	package com.cdgs.worktime.controller;

import java.beans.Statement;
import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;

import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.util.CellReference;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/reports")
@Slf4j

public class ReportController {

	@GetMapping(path = "/timeAttecdance/{month}/{year}")
	public  ResponseEntity<Resource> timeAttendance(@PathVariable(value = "month") Integer month,
			@PathVariable(value = "year") Integer year) throws Exception {
		ArrayList<String> data = new ArrayList<String>();
		
		Connection con = null;
		Class.forName("com.mysql.cj.jdbc.Driver");
		con = DriverManager.getConnection(
				"jdbc:mysql://10.254.40.203:3306/worktime?useSSL=false&characterEncoding=utf-8&serverTimezone=UTC",
				"root", "root");
		
		//database ในเครื่อง
//		con = DriverManager.getConnection(
//				"jdbc:mysql://localhost:3306/worktime?useSSL=false&characterEncoding=utf-8&serverTimezone=UTC",
//				"root", "banyoun1");

		
		java.sql.Statement stEndTime = con.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,
				ResultSet.CONCUR_READ_ONLY);
		java.sql.Statement stStartTime = con.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,
				ResultSet.CONCUR_READ_ONLY);
		ResultSet rsStrrtTime = ((java.sql.Statement) stStartTime)
				.executeQuery("select employee_no, `day`, start_time, work_type\r\n" + "from worktime.employee as e\r\n"
						+ "inner join worktime.employee_has_sidework_history as esh\r\n"
						+ "on e.id_employee = esh.employee_id\r\n" + "inner join worktime.sidework_history as sh\r\n"
						+ "on esh.employee_has_sidework_history_id = sh.employee_has_sidework_history_id\r\n"
						+ "WHERE MONTH(`day`) = " + month + " and YEAR(`day`) = " + year + " and work_type = 1\r\n"
						+ "ORDER BY `day`, start_time ASC");
		ResultSet rsEndTime = ((java.sql.Statement) stEndTime)
				.executeQuery("select employee_no, `day`, end_time, work_type\r\n" + "from worktime.employee as e\r\n"
						+ "inner join worktime.employee_has_sidework_history as esh\r\n"
						+ "on e.id_employee = esh.employee_id\r\n" + "inner join worktime.sidework_history as sh\r\n"
						+ "on esh.employee_has_sidework_history_id = sh.employee_has_sidework_history_id\r\n"
						+ "WHERE MONTH(`day`) = " + month + " and YEAR(`day`) = " + year + " and work_type = 1\r\n"
						+ "ORDER BY `day`, end_time ASC");

		ArrayList<TimeattendanceEmp> attendanceTime = new ArrayList<TimeattendanceEmp>();
		while (rsStrrtTime.next()) {

			String checkId = rsStrrtTime.getString("employee_no");
			if (checkId.contains("T") || checkId.contains("t")) {

			} else {
				String id = rsStrrtTime.getString("employee_no");
				String day = rsStrrtTime.getString("day");
				String startTime = rsStrrtTime.getString("start_time");
				String replaceStringId = id.replace('C', '9');
				attendanceTime.add(new TimeattendanceEmp(replaceStringId, day, startTime));
			}
		}
		rsStrrtTime.beforeFirst();
		rsEndTime.beforeFirst();
		while (rsEndTime.next()) {
			String checkId = rsEndTime.getString("employee_no");
			if (checkId.contains("T") || checkId.contains("t")) {

			} else {
				String id = rsEndTime.getString("employee_no");
				String day = rsEndTime.getString("day");
				String endTime = rsEndTime.getString("end_time");
				String replaceStringId = id.replace('C', '9');
				;
				attendanceTime.add(new TimeattendanceEmp(replaceStringId, day, endTime));
			}
		}
		Collections.sort(attendanceTime, new Comparator<TimeattendanceEmp>() {
			public int compare(TimeattendanceEmp o1, TimeattendanceEmp o2) {
				return o1.getDay().compareTo(o2.getDay());
			}
		});
		for (TimeattendanceEmp str : attendanceTime) {
			data.add(str.getId() + "	" + str.getDay() + " " + str.getTime());
		}

		String monthFormatted = String.format("%02d", month);
		StringBuilder responseData = new StringBuilder();
		for (String text : data) {
			responseData.append(text).append("\n");
		}
		String responseFileName = "add-workanywhere-" + year + monthFormatted + ".dat";

		rsStrrtTime.close();
		rsEndTime.close();
		stStartTime.close();
		stEndTime.close();

		byte[] result = responseData.toString().getBytes("UTF-8");

		HttpHeaders headers = new HttpHeaders();
		headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + responseFileName);
		headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
		headers.add("Pragma", "no-cache");
		headers.add("Expires", "0");
		ByteArrayResource resource = new ByteArrayResource(result);

		return ResponseEntity.ok().headers(headers).contentLength(result.length)
				.contentType(MediaType.APPLICATION_OCTET_STREAM).body(resource);

	}

	@GetMapping(path = "/worktime/{month}")
	public ResponseEntity<Resource> worktimeExcel(@PathVariable(value = "month") Integer getMonth) throws Exception {

		Connection connect = DriverManager.getConnection(
				"jdbc:mysql://10.254.40.203:3306/worktime?useSSL=false&characterEncoding=utf-8&serverTimezone=UTC",
				"root", "root");
		
//		database ในเครื่อง
//		Connection connect = DriverManager.getConnection(
//				"jdbc:mysql://localhost:3306/worktime?useSSL=false&characterEncoding=utf-8&serverTimezone=UTC",
//				"root", "banyoun1");
		
		

		String workTime = "select id_employee,firstname, day(day) date, MONTH(day) month, MONTH(CURRENT_DATE()) current_month, YEAR(day) year, work_anywhere \r\n" + 
				"	from employee as e\r\n" + 
				"	inner join employee_has_sidework_history as esh\r\n" + 
				"	on e.id_employee = esh.employee_id\r\n" + 
				"	inner join sidework_history as sh\r\n" + 
				"	on esh.employee_has_sidework_history_id = sh.employee_has_sidework_history_id\r\n";
				
				

		String Employee = "SELECT employee_no, firstname, lastname, id_employee \r\n"
				+ "FROM employee where active = 'Y' \r\n"
				+ "ORDER BY employee_no ASC";

		java.sql.Statement calendarStatement = connect.createStatement();
		java.sql.Statement nameStatement = connect.createStatement();
		java.sql.Statement dateStatement = connect.createStatement();
 
		ResultSet getCalendar = calendarStatement.executeQuery(workTime);

		// Get year
		int year = Calendar.getInstance().get(Calendar.YEAR);

		// Set month
		String[] month = { "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
				"กันยายน", "ตุลาคม", "พฤษจิกายน", "ธันวาคม" };
		int[] dayOfMonth29 = { 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };
		int[] dayOfMonth28 = { 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };

		// Get calendar
		Calendar calendarDate = Calendar.getInstance();
		Calendar dayOfCalendar = Calendar.getInstance();

		// Creating an instance of HSSFWorkbook.
		XSSFWorkbook workbook = new XSSFWorkbook();

		// Font style on header
		Font headerFont = workbook.createFont();
		headerFont.setColor(IndexedColors.BLACK.getIndex());
		headerFont.setBold(true);

		// Border
		CellStyle border = workbook.createCellStyle();
		border.setBorderTop(BorderStyle.THIN);
		border.setBorderBottom(BorderStyle.THIN);
		border.setBorderLeft(BorderStyle.THIN);
		border.setBorderRight(BorderStyle.THIN);

		// Header style
		CellStyle cellHeaderStyle = workbook.createCellStyle();
		cellHeaderStyle.cloneStyleFrom(border);
		cellHeaderStyle.setAlignment(HorizontalAlignment.CENTER);
		cellHeaderStyle.setVerticalAlignment(VerticalAlignment.CENTER);
		cellHeaderStyle.setFont(headerFont);
		
		// EmpStyle
		// Header style
				CellStyle cellEmpNoStyle = workbook.createCellStyle();
				cellEmpNoStyle.cloneStyleFrom(border);
				cellEmpNoStyle.setAlignment(HorizontalAlignment.CENTER);
				cellEmpNoStyle.setVerticalAlignment(VerticalAlignment.CENTER);
				
		
		
		
		
		// Body style
		CellStyle workTimesStyle = workbook.createCellStyle();
		workTimesStyle.cloneStyleFrom(border);
		workTimesStyle.setAlignment(HorizontalAlignment.CENTER);

		// Footer style
		CellStyle cellFooterStyle = workbook.createCellStyle();
		cellFooterStyle.cloneStyleFrom(border);
		cellFooterStyle.setAlignment(HorizontalAlignment.RIGHT);
		cellFooterStyle.setFont(headerFont);

		// Sunday style
		CellStyle colorRED = workbook.createCellStyle();
		colorRED.cloneStyleFrom(cellHeaderStyle);
		colorRED.setFillForegroundColor(IndexedColors.RED.getIndex());
		colorRED.setFillPattern(FillPatternType.SOLID_FOREGROUND);

		// Monday style
		CellStyle colorYELLOW = workbook.createCellStyle();
		colorYELLOW.cloneStyleFrom(cellHeaderStyle);
		colorYELLOW.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());
		colorYELLOW.setFillPattern(FillPatternType.SOLID_FOREGROUND);

		// Tuesday style
		CellStyle colorCORAL = workbook.createCellStyle();
		colorCORAL.cloneStyleFrom(cellHeaderStyle);
		colorCORAL.setFillForegroundColor(IndexedColors.CORAL.getIndex());
		colorCORAL.setFillPattern(FillPatternType.SOLID_FOREGROUND);

		// Wednesday style
		CellStyle colorLIGHT_GREEN = workbook.createCellStyle();
		colorLIGHT_GREEN.cloneStyleFrom(cellHeaderStyle);
		colorLIGHT_GREEN.setFillForegroundColor(IndexedColors.LIGHT_GREEN.getIndex());
		colorLIGHT_GREEN.setFillPattern(FillPatternType.SOLID_FOREGROUND);

		// Thursday style
		CellStyle colorLIGHTORANGE = workbook.createCellStyle();
		colorLIGHTORANGE.cloneStyleFrom(cellHeaderStyle);
		colorLIGHTORANGE.setFillForegroundColor(IndexedColors.GOLD.getIndex());
		colorLIGHTORANGE.setFillPattern(FillPatternType.SOLID_FOREGROUND);

		// Friday style
		CellStyle colorSKY_BLUE = workbook.createCellStyle();
		colorSKY_BLUE.cloneStyleFrom(cellHeaderStyle);
		colorSKY_BLUE.setFillForegroundColor(IndexedColors.PALE_BLUE.getIndex());
		colorSKY_BLUE.setFillPattern(FillPatternType.SOLID_FOREGROUND);

		// Saturday style
		CellStyle colorPLUM = workbook.createCellStyle();
		colorPLUM.cloneStyleFrom(cellHeaderStyle);
		colorPLUM.setFillForegroundColor(IndexedColors.LAVENDER.getIndex());
		colorPLUM.setFillPattern(FillPatternType.SOLID_FOREGROUND);

		// Data style
		CellStyle ColorGREY25 = workbook.createCellStyle();
		ColorGREY25.cloneStyleFrom(workTimesStyle);
		ColorGREY25.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
		ColorGREY25.setFillPattern(FillPatternType.SOLID_FOREGROUND);

		// Weekends style
		CellStyle ColorLEMON = workbook.createCellStyle();
		ColorLEMON.cloneStyleFrom(cellHeaderStyle);
		ColorLEMON.setFillForegroundColor(IndexedColors.LEMON_CHIFFON.getIndex());
		ColorLEMON.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		
		int indexOfMonth = getMonth - 1;
		
			
//		for (int indexOfMonth = 0; indexOfMonth < month.length; indexOfMonth++) {

			// Create one sheets in the excel document
			Sheet sidework = workbook.createSheet(month[indexOfMonth]);

			ResultSet getName = nameStatement.executeQuery(Employee);

			// Set width column index 0
			sidework.setColumnWidth(0, 15 * 200);
			sidework.setColumnWidth(1, 25 * 260);
			int row = 0;

			int[] sumDay29 = new int[dayOfMonth29[indexOfMonth] + 1];
			int[] sumDay28 = new int[dayOfMonth29[indexOfMonth] + 1];

			for (int i = 1; i <= dayOfMonth29[indexOfMonth]; i++) {
				sumDay29[i] = 0;
			}

			// Header contains
			
			
			
			if (getCalendar.next()) {
				Row dateRow = sidework.createRow(1);
				Row dayNameRow = sidework.createRow(0);
				sidework.addMergedRegion(new CellRangeAddress(0, 1, 0, 0));
				Cell empNoCellR00 = dateRow.createCell(0);
				Cell empNoCellR01 = dayNameRow.createCell(0);
				empNoCellR01.setCellValue("รหัส");
				empNoCellR01.setCellStyle(cellHeaderStyle);
				empNoCellR00.setCellStyle(cellHeaderStyle);
				sidework.addMergedRegion(new CellRangeAddress(0, 1, 1, 1));
				Cell nameHCellR00 = dateRow.createCell(1);
				Cell nameHCellR01 = dayNameRow.createCell(1);
				nameHCellR01.setCellValue("ชื่อ");
				nameHCellR01.setCellStyle(cellHeaderStyle);
				nameHCellR00.setCellStyle(cellHeaderStyle);

				if (year % 4 == 0) {
					for (int i = 0; i < dayOfMonth29[indexOfMonth]; i++) {
						calendarDate.set(Calendar.YEAR, year);
						calendarDate.set(Calendar.MONTH, indexOfMonth);
						calendarDate.set(Calendar.DAY_OF_MONTH, i);

						Date date2 = calendarDate.getTime();
						dayOfCalendar.setTime(date2);
						int dayOfWeek = dayOfCalendar.get(Calendar.DAY_OF_WEEK);
						String nameOfDay = "";

						Cell dayNameCell = dayNameRow.createCell(i + 2);

						Cell dayCell = dateRow.createCell(i + 2);
						dayCell.setCellValue(i + 1);

						if (dayOfWeek == 1) {
							nameOfDay = "จันทร์";
							dayNameCell.setCellStyle(colorYELLOW);
							dayCell.setCellStyle(cellHeaderStyle);
						} else if (dayOfWeek == 2) {
							nameOfDay = "อังคาร";
							dayNameCell.setCellStyle(colorCORAL);
							dayCell.setCellStyle(cellHeaderStyle);
						} else if (dayOfWeek == 3) {
							nameOfDay = "พุธ";
							dayNameCell.setCellStyle(colorLIGHT_GREEN);
							dayCell.setCellStyle(cellHeaderStyle);
						} else if (dayOfWeek == 4) {
							nameOfDay = "พฤหัสบดี";
							dayNameCell.setCellStyle(colorLIGHTORANGE);
							dayCell.setCellStyle(cellHeaderStyle);
						} else if (dayOfWeek == 5) {
							nameOfDay = "ศุกร์";
							dayNameCell.setCellStyle(colorSKY_BLUE);
							dayCell.setCellStyle(cellHeaderStyle);
						} else if (dayOfWeek == 6) {
							nameOfDay = "เสาร์";
							dayNameCell.setCellStyle(colorPLUM);
							dayCell.setCellStyle(ColorLEMON);
						} else if (dayOfWeek == 7) {
							nameOfDay = "อาทิตย์";
							dayNameCell.setCellStyle(colorRED);
							dayCell.setCellStyle(ColorLEMON);
						}
						dayNameCell.setCellValue(nameOfDay);
					}
				} else {
					for (int i = 0; i < dayOfMonth28[indexOfMonth]; i++) {

						calendarDate.set(Calendar.YEAR, year);
						calendarDate.set(Calendar.MONTH, indexOfMonth);
						calendarDate.set(Calendar.DAY_OF_MONTH, i);

						Date date2 = calendarDate.getTime();
						dayOfCalendar.setTime(date2);
						int dayOfWeek = dayOfCalendar.get(Calendar.DAY_OF_WEEK);
						String nameOfDay = "";

						Cell dayNameCell = dayNameRow.createCell(i + 2);

						Cell dayCell = dateRow.createCell(i + 2);
						dayCell.setCellValue(i + 1);

						if (dayOfWeek == 1) {
							nameOfDay = "จันทร์";
							dayNameCell.setCellStyle(colorYELLOW);
							dayCell.setCellStyle(cellHeaderStyle);
						} else if (dayOfWeek == 2) {
							nameOfDay = "อังคาร";
							dayNameCell.setCellStyle(colorCORAL);
							dayCell.setCellStyle(cellHeaderStyle);
						} else if (dayOfWeek == 3) {
							nameOfDay = "พุธ";
							dayNameCell.setCellStyle(colorLIGHT_GREEN);
							dayCell.setCellStyle(cellHeaderStyle);
						} else if (dayOfWeek == 4) {
							nameOfDay = "พฤหัสบดี";
							dayNameCell.setCellStyle(colorLIGHTORANGE);
							dayCell.setCellStyle(cellHeaderStyle);
						} else if (dayOfWeek == 5) {
							nameOfDay = "ศุกร์";
							dayNameCell.setCellStyle(colorSKY_BLUE);
							dayCell.setCellStyle(cellHeaderStyle);
						} else if (dayOfWeek == 6) {
							nameOfDay = "เสาร์";
							dayNameCell.setCellStyle(colorPLUM);
							dayCell.setCellStyle(ColorLEMON);
						} else if (dayOfWeek == 7) {
							nameOfDay = "อาทิตย์";
							dayNameCell.setCellStyle(colorRED);
							dayCell.setCellStyle(ColorLEMON);
						}
						dayNameCell.setCellValue(nameOfDay);
					}
				}

				if (year % 4 == 0) {
					sidework.addMergedRegion(
							new CellRangeAddress(0, 1, dayOfMonth29[indexOfMonth] + 2, dayOfMonth29[indexOfMonth] + 2));
					Cell totalCellR0 = dateRow.createCell(dayOfMonth29[indexOfMonth] + 2);
					Cell totalCellR1 = dayNameRow.createCell(dayOfMonth29[indexOfMonth] + 2);
					totalCellR1.setCellValue("Total");
					totalCellR1.setCellStyle(cellHeaderStyle);
					totalCellR0.setCellStyle(cellHeaderStyle);
				} else {
					sidework.addMergedRegion(
							new CellRangeAddress(0, 1, dayOfMonth28[indexOfMonth] + 2, dayOfMonth28[indexOfMonth] + 2));
					Cell totalCellR0 = dateRow.createCell(dayOfMonth28[indexOfMonth] + 2);
					Cell totalCellR1 = dayNameRow.createCell(dayOfMonth28[indexOfMonth] + 2);
					totalCellR1.setCellValue("Total");
					totalCellR1.setCellStyle(cellHeaderStyle);
					totalCellR0.setCellStyle(cellHeaderStyle);
				}

			} // End header

			// Body
			// Name column
			while (getName.next()) {
				String empNo = getName.getString("employee_no");
				String fname = getName.getString("firstname");
				String lname = getName.getString("lastname");
				Row dataRow = sidework.createRow(row + 2);
				Cell dataEmpNoCell = dataRow.createCell(0);
				Cell dataNameCell = dataRow.createCell(1);
				dataEmpNoCell.setCellValue(empNo);
				dataEmpNoCell.setCellStyle(cellEmpNoStyle);
				dataNameCell.setCellValue(fname + " " + lname);
				dataNameCell.setCellStyle(border);
				dataRow.setRowStyle(border);

				ResultSet getDate = dateStatement.executeQuery(workTime);

				if (year % 4 == 0) {
					for (int i = 0; i < dayOfMonth29[indexOfMonth]; i++) {
						calendarDate.set(Calendar.YEAR, year);
						calendarDate.set(Calendar.MONTH, indexOfMonth);
						calendarDate.set(Calendar.DAY_OF_MONTH, i);

						Date date2 = calendarDate.getTime();
						dayOfCalendar.setTime(date2);
						int dayOfWeek = dayOfCalendar.get(Calendar.DAY_OF_WEEK);

						if (dayOfWeek == 6 || dayOfWeek == 7) {
							Cell dataWeekendsCell = dataRow.createCell(i + 2);
							dataWeekendsCell.setCellStyle(ColorLEMON);
						}
					}
				} else {
					for (int i = 0; i < dayOfMonth28[indexOfMonth]; i++) {
						calendarDate.set(Calendar.YEAR, year);
						calendarDate.set(Calendar.MONTH, indexOfMonth);
						calendarDate.set(Calendar.DAY_OF_MONTH, i);

						Date date2 = calendarDate.getTime();
						dayOfCalendar.setTime(date2);
						int dayOfWeek = dayOfCalendar.get(Calendar.DAY_OF_WEEK);

						if (dayOfWeek == 6 || dayOfWeek == 7) {
							Cell dataWeekendsCell = dataRow.createCell(i + 2);
							dataWeekendsCell.setCellStyle(ColorLEMON);
						}
					}
				}

				// Check work anywhere
				while (getDate.next()) {
					int monthCurrent = indexOfMonth + 1;
					int checkYear = getDate.getInt("year");
					int checkMonth = getDate.getInt("month");

					if (getDate.getInt("id_employee") == getName.getInt("id_employee") && monthCurrent == checkMonth
							&& checkYear == year) {

						int day = getDate.getInt("date");
						int work = getDate.getInt("work_anywhere");
						if (work == 1) {
							if (year % 4 == 0) {
								sumDay29[day] += 1;
							} else {
								sumDay28[day] += 1;
							}
							Cell dateWorkCell = dataRow.createCell(day+1);
							dateWorkCell.setCellValue(1);
							dateWorkCell.setCellStyle(workTimesStyle);
							dateWorkCell.setCellStyle(ColorGREY25);
						}
					}
				}

				if (year % 4 == 0) {
					Cell dataTotalCell = dataRow.createCell(dayOfMonth29[indexOfMonth] + 2);
					int cwllIndex = 1;
					CellReference cr = new CellReference(row + 2, cwllIndex);
					String firstRowKey = cr.formatAsString().replace("$", "");

					CellReference cr2 = new CellReference(row + 2, dayOfMonth29[indexOfMonth]+1);
					String lastRowKey = cr2.formatAsString().replace("$", "");

					dataTotalCell.setCellFormula("SUM(" + firstRowKey + ":" + lastRowKey + ")");
					dataTotalCell.setCellStyle(cellHeaderStyle);
				} else {
					Cell dataTotalCell = dataRow.createCell(dayOfMonth28[indexOfMonth] + 2	);
					int cwllIndex = 1;
					CellReference cr = new CellReference(row + 2, cwllIndex);
					String firstRowKey = cr.formatAsString().replace("$", "");

					CellReference cr2 = new CellReference(row + 2, dayOfMonth28[indexOfMonth]+1);
					String lastRowKey = cr2.formatAsString().replace("$", "");

					dataTotalCell.setCellFormula("SUM(" + firstRowKey + ":" + lastRowKey + ")");
					dataTotalCell.setCellStyle(cellHeaderStyle);
				}
				row = row + 1;
			} // Body end

			// Footer
			Row dataRowSum = sidework.createRow(row + 2);
			Cell sumCell = dataRowSum.createCell(1);
			sumCell.setCellValue("Sum");
			sumCell.setCellStyle(cellFooterStyle);

			int rowIndex = 2;

			// Sum work anywhere by day
			if (year % 4 == 0) {
				for (int i = 0; i < dayOfMonth29[indexOfMonth]; i++) {
					calendarDate.set(Calendar.YEAR, year);
					calendarDate.set(Calendar.MONTH, indexOfMonth);
					calendarDate.set(Calendar.DAY_OF_MONTH, i);

					Date date2 = calendarDate.getTime();
					dayOfCalendar.setTime(date2);
					int dayOfWeek = dayOfCalendar.get(Calendar.DAY_OF_WEEK);

					Cell dataSumCell = dataRowSum.createCell(i + 2);

					if (dayOfWeek == 6 || dayOfWeek == 7) {
						dataSumCell.setCellStyle(ColorLEMON);
					} else {
						dataSumCell.setCellStyle(cellHeaderStyle);
					}

					int cwllIndex = i + 2;
					CellReference cr = new CellReference(rowIndex, cwllIndex);
					String firstRowKey = cr.formatAsString().replace("$", "");

					CellReference cr2 = new CellReference(row + 1, cwllIndex);
					String lastRowKey = cr2.formatAsString().replace("$", "");

					Cell sumDayCell = dataRowSum.createCell(i + 2);
					sumDayCell.setCellFormula("SUM(" + firstRowKey + ":" + lastRowKey + ")");
					sumDayCell.setCellStyle(cellHeaderStyle);
				}
				Cell sumAllCell = dataRowSum.createCell(dayOfMonth29[indexOfMonth] + 2);

				int cwllIndex = dayOfMonth29[indexOfMonth];
				CellReference cr = new CellReference(row + 2, 1);
				String firstRowKey = cr.formatAsString().replace("$", "");

				CellReference cr2 = new CellReference(row + 2, cwllIndex);
				String lastRowKey = cr2.formatAsString().replace("$", "");

				sumAllCell.setCellFormula("SUM(" + firstRowKey + ":" + lastRowKey + ")");
				sumAllCell.setCellStyle(cellHeaderStyle);

			} else {
				for (int i = 0; i < dayOfMonth28[indexOfMonth]; i++) {
					calendarDate.set(Calendar.YEAR, year);
					calendarDate.set(Calendar.MONTH, indexOfMonth);
					calendarDate.set(Calendar.DAY_OF_MONTH, i);

					Date date2 = calendarDate.getTime();
					dayOfCalendar.setTime(date2);
					int dayOfWeek = dayOfCalendar.get(Calendar.DAY_OF_WEEK);

					Cell dataSumCell = dataRowSum.createCell(i + 2);

					if (dayOfWeek == 6 || dayOfWeek == 7) {
						dataSumCell.setCellStyle(ColorLEMON);
					} else {
						dataSumCell.setCellStyle(cellHeaderStyle);
					}

					int cwllIndex = i + 2;
					CellReference cr = new CellReference(rowIndex, cwllIndex);
					String firstRowKey = cr.formatAsString().replace("$", "");

					CellReference cr2 = new CellReference(row + 1, cwllIndex);
					String lastRowKey = cr2.formatAsString().replace("$", "");

					Cell sumDayCell = dataRowSum.createCell(i + 2);
					sumDayCell.setCellFormula("SUM(" + firstRowKey + ":" + lastRowKey + ")");
					sumDayCell.setCellStyle(cellHeaderStyle);
				}
				Cell sumAllCell = dataRowSum.createCell(dayOfMonth29[indexOfMonth] + 2);

				int cwllIndex = dayOfMonth28[indexOfMonth];
				CellReference cr = new CellReference(row + 2, 1);
				String firstRowKey = cr.formatAsString().replace("$", "");

				CellReference cr2 = new CellReference(row + 2, cwllIndex);
				String lastRowKey = cr2.formatAsString().replace("$", "");

				sumAllCell.setCellFormula("SUM(" + firstRowKey + ":" + lastRowKey + ")");
				sumAllCell.setCellStyle(cellHeaderStyle);
			} // End Footer

//		}

		ByteArrayOutputStream result = new ByteArrayOutputStream();
		workbook.write(result);

		HttpHeaders headers = new HttpHeaders();
		headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=worktimeExcel" + year + ".xlsx");
		headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
		headers.add("Pragma", "no-cache");
		headers.add("Expires", "0");
		ByteArrayResource resource = new ByteArrayResource(result.toByteArray());

		return ResponseEntity.ok().headers(headers).contentLength(result.toByteArray().length)
				.contentType(MediaType.APPLICATION_OCTET_STREAM).body(resource);
	}
}
