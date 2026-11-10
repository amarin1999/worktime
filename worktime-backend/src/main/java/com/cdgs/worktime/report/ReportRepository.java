package com.cdgs.worktime.report;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.List;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

/** Read-only, parameterized queries used by the reports. */
@Repository
class ReportRepository {

	record EmployeeRow(long id, String employeeNo, String firstname, String lastname) {
	}

	record SideworkRow(String employeeNo, long employeeId, LocalDate day, LocalTime startTime, LocalTime endTime,
			Integer workAnywhere) {
	}

	private final JdbcClient jdbc;

	ReportRepository(JdbcClient jdbc) {
		this.jdbc = jdbc;
	}

	List<EmployeeRow> activeEmployees() {
		return jdbc.sql("""
				SELECT id_employee, employee_no, firstname, lastname FROM employee
				WHERE active = 'Y' ORDER BY employee_no""")
				.query((rs, i) -> new EmployeeRow(rs.getLong(1), rs.getString(2), rs.getString(3), rs.getString(4)))
				.list();
	}

	/** Employees excluding test accounts (employee numbers starting with "t"). */
	List<EmployeeRow> realEmployees() {
		return jdbc.sql("""
				SELECT id_employee, employee_no, firstname, lastname FROM employee
				WHERE employee_no NOT LIKE 't%' AND employee_no NOT LIKE 'T%' ORDER BY employee_no""")
				.query((rs, i) -> new EmployeeRow(rs.getLong(1), rs.getString(2), rs.getString(3), rs.getString(4)))
				.list();
	}

	List<SideworkRow> sideworkIn(YearMonth month) {
		return jdbc.sql("""
				SELECT e.employee_no, e.id_employee, sh.`day`, sh.start_time, sh.end_time, sh.work_anywhere
				FROM employee e
				JOIN employee_has_sidework_history esh ON e.id_employee = esh.employee_id
				JOIN sidework_history sh ON esh.employee_has_sidework_history_id = sh.employee_has_sidework_history_id
				WHERE esh.work_type = 1 AND sh.`day` >= :from AND sh.`day` < :to
				ORDER BY sh.`day`, sh.start_time""")
				.param("from", month.atDay(1)).param("to", month.plusMonths(1).atDay(1))
				.query((rs, i) -> new SideworkRow(rs.getString(1), rs.getLong(2), rs.getObject(3, LocalDate.class),
						rs.getObject(4, LocalTime.class), rs.getObject(5, LocalTime.class),
						(Integer) rs.getObject(6, Integer.class)))
				.list();
	}
}
