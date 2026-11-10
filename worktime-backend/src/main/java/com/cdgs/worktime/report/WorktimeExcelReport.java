package com.cdgs.worktime.report;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.time.DayOfWeek;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.util.CellReference;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.cdgs.worktime.report.ReportRepository.EmployeeRow;
import com.cdgs.worktime.report.ReportRepository.SideworkRow;

/**
 * Monthly "work anywhere" sheet: one row per active employee, one column per day; a 1 marks a WFH day.
 * Layout as in v1: columns รหัส / ชื่อ / day 1..n / Total, a Sum row at the bottom.
 */
final class WorktimeExcelReport {

	private static final int WFH = 1;
	private static final int FIRST_DAY_COL = 2;

	private WorktimeExcelReport() {
	}

	static byte[] build(YearMonth month, List<EmployeeRow> employees, List<SideworkRow> sidework) {
		Map<Long, Set<Integer>> wfhDays = new HashMap<>();
		for (SideworkRow r : sidework) {
			if (r.workAnywhere() != null && r.workAnywhere() == WFH) {
				wfhDays.computeIfAbsent(r.employeeId(), k -> new HashSet<>()).add(r.day().getDayOfMonth());
			}
		}

		try (XSSFWorkbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
			ReportStyles styles = new ReportStyles(workbook, IndexedColors.LIGHT_GREEN);
			Sheet sheet = workbook.createSheet(ReportStyles.THAI_MONTHS[month.getMonthValue() - 1]);
			sheet.setColumnWidth(0, 15 * 200);
			sheet.setColumnWidth(1, 25 * 260);

			int days = month.lengthOfMonth();
			int totalCol = FIRST_DAY_COL + days;

			// Header: row 0 = day names, row 1 = day numbers
			Row dayNameRow = sheet.createRow(0);
			Row dateRow = sheet.createRow(1);
			mergedHeader(sheet, dayNameRow, dateRow, 0, "รหัส", styles.header);
			mergedHeader(sheet, dayNameRow, dateRow, 1, "ชื่อ", styles.header);
			for (int d = 1; d <= days; d++) {
				DayOfWeek dow = month.atDay(d).getDayOfWeek();
				Cell name = dayNameRow.createCell(FIRST_DAY_COL + d - 1);
				name.setCellValue(ReportStyles.thaiDayName(dow));
				name.setCellStyle(styles.dayName(dow));
				Cell number = dateRow.createCell(FIRST_DAY_COL + d - 1);
				number.setCellValue(d);
				number.setCellStyle(ReportStyles.isWeekend(dow) ? styles.weekend : styles.header);
			}
			mergedHeader(sheet, dayNameRow, dateRow, totalCol, "Total", styles.header);

			// Body
			int rowIndex = 2;
			for (EmployeeRow e : employees) {
				Row row = sheet.createRow(rowIndex);
				cell(row, 0, e.employeeNo(), styles.centered);
				cell(row, 1, e.firstname() + " " + e.lastname(), styles.border);
				Set<Integer> worked = wfhDays.getOrDefault(e.id(), Set.of());
				for (int d = 1; d <= days; d++) {
					DayOfWeek dow = month.atDay(d).getDayOfWeek();
					Cell c = row.createCell(FIRST_DAY_COL + d - 1);
					if (worked.contains(d)) {
						c.setCellValue(1);
						c.setCellStyle(styles.worked);
					} else {
						c.setCellStyle(ReportStyles.isWeekend(dow) ? styles.weekend : styles.border);
					}
				}
				Cell total = row.createCell(totalCol);
				total.setCellFormula(sum(rowIndex, FIRST_DAY_COL, rowIndex, totalCol - 1));
				total.setCellStyle(styles.header);
				rowIndex++;
			}

			// Footer
			Row sumRow = sheet.createRow(rowIndex);
			cell(sumRow, 1, "Sum", styles.footer);
			for (int col = FIRST_DAY_COL; col <= totalCol; col++) {
				Cell c = sumRow.createCell(col);
				if (rowIndex > 2) {
					c.setCellFormula(sum(2, col, rowIndex - 1, col));
				} else {
					c.setCellValue(0);
				}
				c.setCellStyle(styles.header);
			}

			workbook.write(out);
			return out.toByteArray();
		} catch (IOException e) {
			throw new UncheckedIOException(e);
		}
	}

	private static void mergedHeader(Sheet sheet, Row top, Row bottom, int col, String text, CellStyle style) {
		cell(top, col, text, style);
		bottom.createCell(col).setCellStyle(style);
		sheet.addMergedRegion(new CellRangeAddress(0, 1, col, col));
	}

	private static void cell(Row row, int col, String value, CellStyle style) {
		Cell c = row.createCell(col);
		c.setCellValue(value);
		c.setCellStyle(style);
	}

	private static String sum(int r1, int c1, int r2, int c2) {
		return "SUM(" + new CellReference(r1, c1).formatAsString(false) + ":"
				+ new CellReference(r2, c2).formatAsString(false) + ")";
	}
}
