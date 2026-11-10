package com.cdgs.worktime.maintenance;

import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Finds (and optionally fixes) legacy Buddhist-era years in the history tables. */
@Service
public class MaintenanceService {

	private static final int MAX_EXAMPLES = 5;

	private static final List<Target> TARGETS = List.of(
			new Target("sidework_history", "day", "id_sidework_history", true),
			new Target("sidework_history", "last_update_time", "id_sidework_history", false),
			new Target("ot_history", "start_time", "id_ot_history", false),
			new Target("ot_history", "end_time", "id_ot_history", false),
			new Target("ot_history", "last_update_time", "id_ot_history", false));

	private final JdbcClient jdbc;

	public MaintenanceService(JdbcClient jdbc) {
		this.jdbc = jdbc;
	}

	record Target(String table, String column, String idColumn, boolean dateOnly) {
		String name() {
			return table + "." + column;
		}
	}

	public record Change(long id, String oldValue, String newValue) {
		@Override
		public String toString() {
			return id + ": " + oldValue + " -> " + newValue;
		}
	}

	public record ColumnResult(String column, int count, int updated, List<Change> examples, List<String> invalid) {
	}

	private record Row(long id, LocalDate date, LocalDateTime dateTime) {
	}

	/**
	 * @param apply false = report only (nothing written); true = update all rows, rolling back everything if any
	 *              value cannot be converted
	 */
	@Transactional
	public List<ColumnResult> fixBuddhistYears(boolean apply) {
		List<ColumnResult> results = new ArrayList<>();
		for (Target t : TARGETS) {
			results.add(process(t, apply));
		}
		return results;
	}

	private ColumnResult process(Target t, boolean apply) {
		String select = "SELECT " + t.idColumn() + ", `" + t.column() + "` FROM " + t.table()
				+ " WHERE `" + t.column() + "` IS NOT NULL ORDER BY " + t.idColumn();
		String update = "UPDATE " + t.table() + " SET `" + t.column() + "` = :value WHERE " + t.idColumn() + " = :id";

		List<Row> rows = t.dateOnly()
				? jdbc.sql(select).query((rs, n) -> new Row(rs.getLong(1), rs.getObject(2, LocalDate.class), null)).list()
				: jdbc.sql(select).query((rs, n) -> new Row(rs.getLong(1), null, rs.getObject(2, LocalDateTime.class))).list();

		List<Change> examples = new ArrayList<>();
		List<String> invalid = new ArrayList<>();
		int count = 0;
		int updated = 0;
		for (Row r : rows) {
			Object old = t.dateOnly() ? r.date() : r.dateTime();
			boolean be = t.dateOnly() ? BuddhistYearConverter.isBuddhist(r.date())
					: BuddhistYearConverter.isBuddhist(r.dateTime());
			if (!be) {
				continue;
			}
			count++;
			Object converted;
			try {
				converted = t.dateOnly() ? BuddhistYearConverter.convert(r.date())
						: BuddhistYearConverter.convert(r.dateTime());
			} catch (DateTimeException e) {
				invalid.add(r.id() + ": " + old + " (" + e.getMessage() + ")");
				continue;
			}
			if (examples.size() < MAX_EXAMPLES) {
				examples.add(new Change(r.id(), String.valueOf(old), String.valueOf(converted)));
			}
			if (apply) {
				jdbc.sql(update).param("value", converted).param("id", r.id()).update();
				updated++;
			}
		}
		if (apply && !invalid.isEmpty()) {
			throw new IllegalStateException(t.name() + ": " + invalid.size()
					+ " value(s) cannot be converted, rolled back. First: " + invalid.get(0));
		}
		return new ColumnResult(t.name(), count, updated, examples, invalid);
	}
}
