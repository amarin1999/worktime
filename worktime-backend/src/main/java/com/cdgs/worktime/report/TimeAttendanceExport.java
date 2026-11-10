package com.cdgs.worktime.report;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

import com.cdgs.worktime.report.ReportRepository.SideworkRow;

/**
 * Builds the time attendance import file ({@code add-workanywhere-YYYYMM.dat}).
 * Format kept from v1: one line per clock-in and per clock-out, {@code <empNo>\t<yyyy-MM-dd> <HH:mm:ss>},
 * grouped by day (all clock-ins of the day first, then all clock-outs). Employee numbers containing "T" are
 * test accounts and are skipped; the letter "C" is replaced with "9" as the time attendance system expects.
 */
final class TimeAttendanceExport {

	private static final DateTimeFormatter TIME = DateTimeFormatter.ofPattern("HH:mm:ss");

	private TimeAttendanceExport() {
	}

	private record Line(String employeeNo, String day, String time, int order) {
	}

	static String build(List<SideworkRow> rows) {
		List<Line> lines = new ArrayList<>();
		for (SideworkRow r : rows) {
			if (r.employeeNo().toUpperCase(Locale.ROOT).contains("T")) {
				continue;
			}
			String id = r.employeeNo().replace('C', '9');
			lines.add(new Line(id, r.day().toString(), TIME.format(r.startTime()), 0));
			if (r.endTime() != null) {
				lines.add(new Line(id, r.day().toString(), TIME.format(r.endTime()), 1));
			}
		}
		lines.sort(Comparator.comparing(Line::day).thenComparingInt(Line::order).thenComparing(Line::time));
		StringBuilder sb = new StringBuilder();
		for (Line l : lines) {
			sb.append(l.employeeNo()).append('\t').append(l.day()).append(' ').append(l.time()).append('\n');
		}
		return sb.toString();
	}
}
