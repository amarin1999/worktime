package com.cdgs.worktime.maintenance;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class MaintenanceServiceTest {

	@Autowired
	MaintenanceService service;
	@Autowired
	JdbcClient jdbc;

	int eshId;

	@BeforeEach
	void setUp() {
		jdbc.sql("INSERT INTO employee_has_sidework_history (employee_id, work_type) VALUES (2, 1)").update();
		eshId = jdbc.sql("SELECT MAX(employee_has_sidework_history_id) FROM employee_has_sidework_history")
				.query(Integer.class).single();
	}

	@AfterEach
	void tearDown() {
		jdbc.sql("DELETE FROM sidework_history WHERE employee_has_sidework_history_id = :e").param("e", eshId).update();
		jdbc.sql("DELETE FROM ot_history WHERE employee_has_sidework_history_id = :e").param("e", eshId).update();
		jdbc.sql("DELETE FROM employee_has_sidework_history WHERE employee_has_sidework_history_id = :e")
				.param("e", eshId).update();
	}

	private int insertSidework(LocalDate day, LocalDateTime updated) {
		jdbc.sql("INSERT INTO sidework_history (employee_has_sidework_history_id, start_time, last_update_time, `day`) "
				+ "VALUES (:e, '08:00:00', :u, :d)").param("e", eshId).param("u", updated).param("d", day).update();
		return jdbc.sql("SELECT MAX(id_sidework_history) FROM sidework_history").query(Integer.class).single();
	}

	private int insertOt(LocalDateTime start, LocalDateTime end, LocalDateTime updated) {
		jdbc.sql("INSERT INTO ot_history (employee_has_sidework_history_id, start_time, end_time, last_update_time) "
				+ "VALUES (:e, :s, :n, :u)").param("e", eshId).param("s", start).param("n", end).param("u", updated)
				.update();
		return jdbc.sql("SELECT MAX(id_ot_history) FROM ot_history").query(Integer.class).single();
	}

	@Test
	void reportChangesNothingAndApplyConverts() {
		int s1 = insertSidework(LocalDate.of(2563, 3, 31), LocalDateTime.of(3106, 3, 24, 15, 26));
		int s2 = insertSidework(LocalDate.of(2026, 11, 10), LocalDateTime.of(2026, 11, 10, 9, 0));
		int o1 = insertOt(LocalDateTime.of(2563, 3, 31, 18, 0), LocalDateTime.of(2563, 3, 31, 20, 30),
				LocalDateTime.of(2563, 4, 1, 1, 2, 3));

		List<MaintenanceService.ColumnResult> report = service.fixBuddhistYears(false);
		assertThat(report).filteredOn(r -> r.column().equals("sidework_history.day")).singleElement()
				.satisfies(r -> assertThat(r.count()).isEqualTo(1));
		assertThat(day(s1)).isEqualTo(LocalDate.of(2563, 3, 31));

		service.fixBuddhistYears(true);
		assertThat(day(s1)).isEqualTo(LocalDate.of(2020, 3, 31));
		assertThat(day(s2)).isEqualTo(LocalDate.of(2026, 11, 10));
		assertThat(jdbc.sql("SELECT last_update_time FROM sidework_history WHERE id_sidework_history = :i")
				.param("i", s1).query(LocalDateTime.class).single()).isEqualTo(LocalDateTime.of(2020, 3, 24, 15, 26));
		assertThat(jdbc.sql("SELECT end_time FROM ot_history WHERE id_ot_history = :i")
				.param("i", o1).query(LocalDateTime.class).single()).isEqualTo(LocalDateTime.of(2020, 3, 31, 20, 30));
		assertThat(service.fixBuddhistYears(false)).allSatisfy(r -> assertThat(r.count()).isZero());
	}

	@Test
	void applyAbortsOnInvalidDate() {
		int s = insertSidework(LocalDate.of(2580, 2, 29), LocalDateTime.of(2026, 1, 1, 0, 0));
		assertThat(service.fixBuddhistYears(false)).anySatisfy(r -> assertThat(r.invalid()).hasSize(1));
		assertThatThrownBy(() -> service.fixBuddhistYears(true)).isInstanceOf(IllegalStateException.class);
		assertThat(day(s)).isEqualTo(LocalDate.of(2580, 2, 29));
	}

	private LocalDate day(int id) {
		return jdbc.sql("SELECT `day` FROM sidework_history WHERE id_sidework_history = :i").param("i", id)
				.query(LocalDate.class).single();
	}
}
