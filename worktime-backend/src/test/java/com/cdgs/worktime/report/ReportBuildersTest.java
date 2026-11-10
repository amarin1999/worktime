package com.cdgs.worktime.report;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.List;

import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;

import com.cdgs.worktime.report.LeaveExcelReport.LeaveEntry;
import com.cdgs.worktime.report.ReportRepository.EmployeeRow;
import com.cdgs.worktime.report.ReportRepository.SideworkRow;

class ReportBuildersTest {

	private static final YearMonth NOV_2026 = YearMonth.of(2026, 11); // 1 Nov 2026 is a Sunday, 30 days

	@Test
	void timeAttendanceListsClockInsThenClockOutsPerDay() {
		List<SideworkRow> rows = List.of(
				new SideworkRow("C0002", 2, LocalDate.of(2026, 11, 2), LocalTime.of(9, 0), LocalTime.of(18, 0), 1),
				new SideworkRow("C0003", 3, LocalDate.of(2026, 11, 2), LocalTime.of(8, 0), LocalTime.of(17, 0), 2),
				new SideworkRow("t005", 4, LocalDate.of(2026, 11, 2), LocalTime.of(8, 0), LocalTime.of(17, 0), 1),
				new SideworkRow("C0002", 2, LocalDate.of(2026, 11, 1), LocalTime.of(8, 30), null, 1));
		assertThat(TimeAttendanceExport.build(rows)).isEqualTo("""
				90002\t2026-11-01 08:30:00
				90003\t2026-11-02 08:00:00
				90002\t2026-11-02 09:00:00
				90003\t2026-11-02 17:00:00
				90002\t2026-11-02 18:00:00
				""");
	}

	@Test
	void worktimeSheetMarksWfhDaysAndTotals() throws Exception {
		byte[] xlsx = WorktimeExcelReport.build(NOV_2026,
				List.of(new EmployeeRow(2, "C0002", "Alice", "A"), new EmployeeRow(3, "C0003", "Bob", "B")),
				List.of(new SideworkRow("C0002", 2, LocalDate.of(2026, 11, 2), LocalTime.of(9, 0), null, 1),
						new SideworkRow("C0003", 3, LocalDate.of(2026, 11, 2), LocalTime.of(9, 0), null, 2)));
		try (XSSFWorkbook wb = new XSSFWorkbook(new ByteArrayInputStream(xlsx))) {
			Sheet s = wb.getSheetAt(0);
			assertThat(s.getSheetName()).isEqualTo("พฤศจิกายน");
			assertThat(s.getRow(0).getCell(0).getStringCellValue()).isEqualTo("รหัส");
			assertThat(s.getRow(0).getCell(2).getStringCellValue()).isEqualTo("อาทิตย์"); // 1 Nov
			assertThat(s.getRow(0).getCell(3).getStringCellValue()).isEqualTo("จันทร์"); // 2 Nov
			assertThat(s.getRow(1).getCell(31).getNumericCellValue()).isEqualTo(30);
			assertThat(s.getRow(0).getCell(32).getStringCellValue()).isEqualTo("Total");
			assertThat(s.getRow(2).getCell(1).getStringCellValue()).isEqualTo("Alice A");
			assertThat(s.getRow(2).getCell(3).getNumericCellValue()).isEqualTo(1); // WFH on 2 Nov
			assertThat(s.getRow(3).getCell(3).getCellType().name()).isEqualTo("BLANK"); // site work is not WFH
			assertThat(s.getRow(2).getCell(32).getCellFormula()).isEqualTo("SUM(C3:AF3)");
			assertThat(s.getRow(4).getCell(1).getStringCellValue()).isEqualTo("Sum");
			assertThat(s.getRow(4).getCell(3).getCellFormula()).isEqualTo("SUM(D3:D4)");
		}
	}

	@Test
	void leaveSheetListsNamesPerDayWithCounts() throws Exception {
		byte[] xlsx = LeaveExcelReport.build(NOV_2026,
				List.of(new LeaveEntry("Alice A", LocalDate.of(2026, 11, 12), "VACA"),
						new LeaveEntry("Bob B", LocalDate.of(2026, 11, 12), "SICK"),
						new LeaveEntry("Out of range", LocalDate.of(2026, 12, 1), "VACA")));
		try (XSSFWorkbook wb = new XSSFWorkbook(new ByteArrayInputStream(xlsx))) {
			Sheet s = wb.getSheetAt(0);
			assertThat(s.getRow(0).getCell(0).getStringCellValue()).isEqualTo("วันที่");
			assertThat(s.getRow(2).getCell(12).getStringCellValue()).isEqualTo("Alice A");
			assertThat(s.getRow(3).getCell(12).getStringCellValue()).isEqualTo("Bob B");
			assertThat(s.getRow(2).getCell(0).getStringCellValue()).isEqualTo("ลาพักผ่อน");
			assertThat(s.getRow(10).getCell(0).getStringCellValue()).isEqualTo("รวมทั้งหมด");
			assertThat(s.getRow(10).getCell(12).getNumericCellValue()).isEqualTo(2);
			assertThat(s.getRow(10).getCell(1).getNumericCellValue()).isZero();
		}
	}
}
