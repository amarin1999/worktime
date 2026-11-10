package com.cdgs.worktime.report;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

/**
 * Monthly leave sheet: one column per day listing the employees on leave that day, coloured by leave type.
 * Layout as in v1: header rows 0-1, names from row 2, a legend in column A, a "รวมทั้งหมด" count row at the
 * bottom (at least 8 body rows).
 */
final class LeaveExcelReport {

	record LeaveEntry(String employeeName, LocalDate date, String type) {
	}

	private static final int MIN_BODY_ROWS = 8;

	private LeaveExcelReport() {
	}

	static byte[] build(YearMonth month, List<LeaveEntry> leaves) {
		Map<Integer, List<LeaveEntry>> byDay = new TreeMap<>();
		for (LeaveEntry l : leaves) {
			if (YearMonth.from(l.date()).equals(month)) {
				byDay.computeIfAbsent(l.date().getDayOfMonth(), k -> new ArrayList<>()).add(l);
			}
		}

		try (XSSFWorkbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
			ReportStyles styles = new ReportStyles(workbook, IndexedColors.BRIGHT_GREEN);
			CellStyle vacation = leaveStyle(styles, IndexedColors.LIGHT_GREEN);
			CellStyle sick = leaveStyle(styles, IndexedColors.YELLOW);
			CellStyle personal = leaveStyle(styles, IndexedColors.PALE_BLUE);
			CellStyle other = leaveStyle(styles, IndexedColors.LIGHT_ORANGE);
			CellStyle totalStyle = leaveStyle(styles, IndexedColors.GREY_40_PERCENT);
			Font white = workbook.createFont();
			white.setBold(true);
			white.setColor(IndexedColors.WHITE.getIndex());
			totalStyle.setFont(white);

			Sheet sheet = workbook.createSheet(ReportStyles.THAI_MONTHS[month.getMonthValue() - 1]);
			int days = month.lengthOfMonth();
			int maxPerDay = byDay.values().stream().mapToInt(List::size).max().orElse(0);
			int bodyRows = Math.max(maxPerDay, MIN_BODY_ROWS);
			int totalRow = 2 + bodyRows;

			// Header
			Row dayNameRow = sheet.createRow(0);
			Row dateRow = sheet.createRow(1);
			Cell corner = dayNameRow.createCell(0);
			corner.setCellValue("วันที่");
			corner.setCellStyle(styles.header);
			dateRow.createCell(0).setCellStyle(styles.header);
			sheet.addMergedRegion(new CellRangeAddress(0, 1, 0, 0));
			sheet.setColumnWidth(0, 25 * 250);
			for (int d = 1; d <= days; d++) {
				DayOfWeek dow = month.atDay(d).getDayOfWeek();
				sheet.setColumnWidth(d, 25 * 250);
				Cell name = dayNameRow.createCell(d);
				name.setCellValue(ReportStyles.thaiDayName(dow));
				name.setCellStyle(styles.dayName(dow));
				Cell number = dateRow.createCell(d);
				number.setCellValue(d);
				number.setCellStyle(ReportStyles.isWeekend(dow) ? styles.weekend : styles.header);
			}

			// Body grid (borders, weekend shading)
			for (int r = 2; r < totalRow; r++) {
				Row row = sheet.createRow(r);
				row.createCell(0).setCellStyle(styles.border);
				for (int d = 1; d <= days; d++) {
					boolean weekend = ReportStyles.isWeekend(month.atDay(d).getDayOfWeek());
					row.createCell(d).setCellStyle(weekend ? styles.weekend : styles.border);
				}
			}

			// Legend in column A
			legend(sheet, 2, "ลาพักผ่อน", vacation);
			legend(sheet, 3, "ลากิจ", personal);
			legend(sheet, 4, "ลาป่วย", sick);
			legend(sheet, 5, "อื่นๆ", other);

			// Names
			byDay.forEach((day, entries) -> {
				for (int i = 0; i < entries.size(); i++) {
					LeaveEntry e = entries.get(i);
					Cell c = sheet.getRow(2 + i).getCell(day);
					c.setCellValue(e.employeeName());
					c.setCellStyle(switch (e.type() == null ? "" : e.type()) {
					case "VACA" -> vacation;
					case "SICK" -> sick;
					case "PERS" -> personal;
					default -> other;
					});
				}
			});

			// Totals
			Row total = sheet.createRow(totalRow);
			Cell label = total.createCell(0);
			label.setCellValue("รวมทั้งหมด");
			label.setCellStyle(totalStyle);
			for (int d = 1; d <= days; d++) {
				Cell c = total.createCell(d);
				c.setCellValue(byDay.getOrDefault(d, List.of()).size());
				c.setCellStyle(totalStyle);
			}

			workbook.write(out);
			return out.toByteArray();
		} catch (IOException e) {
			throw new UncheckedIOException(e);
		}
	}

	private static CellStyle leaveStyle(ReportStyles styles, IndexedColors color) {
		CellStyle style = styles.filled(styles.border, color);
		style.setWrapText(true);
		style.setVerticalAlignment(VerticalAlignment.TOP);
		return style;
	}

	private static void legend(Sheet sheet, int rowIndex, String text, CellStyle style) {
		Cell c = sheet.getRow(rowIndex).getCell(0);
		c.setCellValue(text);
		c.setCellStyle(style);
	}
}
