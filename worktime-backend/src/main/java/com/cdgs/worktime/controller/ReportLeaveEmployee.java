package com.cdgs.worktime.controller;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.cdgs.worktime.dto.EmployeeDto;
import com.cdgs.worktime.dto.GetEmployeeNo;
import com.cdgs.worktime.dto.GetLeaveEmployeeResponse;
import com.cdgs.worktime.dto.LeaveEmployeeDto;
import com.cdgs.worktime.entity.EmployeeEntity;
import com.cdgs.worktime.repository.EmployeeRespository;
import com.cdgs.worktime.service.EmployeeService;
import com.cdgs.worktime.util.ResponseDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.mail.iap.Response;

import lombok.extern.slf4j.Slf4j;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/reports")
@Slf4j
public class ReportLeaveEmployee {
	@Autowired
	EmployeeRespository employeeService;
	@GetMapping("/getDailyReport/{month}/{year}")
	@ResponseBody
	public String leaveEmployeeExcel(@PathVariable(value = "month")Integer month,@PathVariable(value = "year")Integer year)
			throws IOException, SQLException {
		
			int status;	
			String line = null;
			ResponseDto<LeaveEmployeeDto> res = new ResponseDto<LeaveEmployeeDto>();
			ArrayList<EmployeeDto> listResult = new ArrayList<EmployeeDto>();
			List<EmployeeEntity> dto = new ArrayList<EmployeeEntity>();
			// SQL GET EmployeeNo
			Connection myConn = null;
			Statement myStmt = null;
			ResultSet myRs = null;
			List<String> enpNo =new ArrayList<String>();

		try {
			// 1. Get a connection to database
			myConn = DriverManager.getConnection("jdbc:mysql://localhost:3306/worktime", "root" , "1234");
			
			// 2. Create a statement
			myStmt = myConn.createStatement();	
			
			// 3. Execute SQL query
			myRs = myStmt.executeQuery("select * from employee WHERE employee_no NOT LIKE 't%' ");
			
			// 4. Process the result set
			while (myRs.next()) {
				//System.out.println(myRs.getString("employee_no"));
				String data = myRs.getString("employee_no");
				enpNo.add(myRs.getString("employee_no"));
//				JSONObject join = new JSONObject();
//				join.put("employee_no", myRs.getString("employee_no"));
//				res.put(join);
			}
			//
			System.out.print(enpNo);
			//
			Map<String, GetLeaveEmployeeResponse> responses = new HashMap<>();
			ObjectMapper OBJECT_MAPPER = new ObjectMapper();
			for (int i = 0; i < enpNo.size(); i++) {
				URL url = new URL("http://localhost:8080/workTimeAPI/getLeaveEmployee/"+month+"/"+year+"/"+enpNo.get(i));
				HttpURLConnection connection = null;
				try {
					connection = (HttpURLConnection) url.openConnection();
					connection.connect();
					status = connection.getResponseCode();
					if (status == 200) {

						BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream()));
						StringBuilder sb = new StringBuilder();
						while ((line = br.readLine()) != null) {
							sb.append(line + "\n");
							System.out.println(line.strip());
						}
						br.close();
						
						responses.put(enpNo.get(i), OBJECT_MAPPER.readValue(sb.toString(), GetLeaveEmployeeResponse.class));
					} else {
						return "{}";
					}
				} finally {
					if (connection != null) {
						connection.disconnect();
					}
					if (myRs != null) {
						myRs.close();
					}
					
					if (myStmt != null) {
						myStmt.close();
					}
					
					if (myConn != null) {
						myConn.close();
					}
				}
			}
			return OBJECT_MAPPER.writeValueAsString(responses);

//			for (int i = 0; i < data.length; i++) {
//				URL url = new URL("http://localhost:8080/workTimeAPI/getLeaveEmployee/2020/" + data[i]);
//				HttpURLConnection connection = (HttpURLConnection) url.openConnection();
//				status = connection.getResponseCode();
//				if (status == 200) {
//
//					BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream()));
//					StringBuilder sb = new StringBuilder(); 
//					while ((line = br.readLine()) != null) {
//						sb.append(line + "\n");
//					}
//					br.close();
//					return sb.toString();

//					InputStream inputStream = connection.getInputStream();
//					StringBuffer stringBuffer = new StringBuffer();
//					BufferedReader buffer = new BufferedReader(new InputStreamReader(inputStream));
//					line = buffer.readLine();
//					while (line != null) {
//						stringBuffer.append(line);
//						line = buffer.readLine();
//						listResult.add(new LeaveEmployeeDto(line, line, null));
//
//					}
//
//					System.out.println(stringBuffer.toString());
//					return JSONWriter.valueToString(stringBuffer.toString());
//				}
//
//			}
//			res.setResult(ResponseDto.RESPONSE_RESULT.Success.getRes());
//			res.setData(listResult);
//			res.setCode(201);
//			return new ResponseEntity<ResponseDto<LeaveEmployeeDto>>(res,HttpStatus.OK);

		} catch (Exception e) {
			e.printStackTrace();
//			res.setResult(ResponseDto.RESPONSE_RESULT.Success.getRes());
//			res.setErrorMessage(e.getMessage());
//			res.setCode(201);
//			return new ResponseEntity<ResponseDto<LeaveEmployeeDto>>(res,HttpStatus.OK);
		}
		return line;

	}
	
	@GetMapping("leaveReport/{month}/{year}")
	public ResponseEntity<Resource> leaveReport(@PathVariable(value = "month") Integer getMonth , @PathVariable(value = "year")Integer getYear) throws IOException, SQLException {
		XSSFWorkbook workbook = new XSSFWorkbook();
		

		// Get year
		int year = Calendar.getInstance().get(Calendar.YEAR);
		final String LEAVE_1 = "วันลา";
		// Set month
		String[] month = { "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
				"กันยายน", "ตุลาคม", "พฤษจิกายน", "ธันวาคม" };
		int[] dayOfMonth29 = { 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };
		int[] dayOfMonth28 = { 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };
		
		
		// Get calendar
		Calendar calendarDate = Calendar.getInstance();
		Calendar dayOfCalendar = Calendar.getInstance();

		int indexOfMonth = getMonth - 1;

		// Create one sheets in the excel document
		XSSFSheet sheet = workbook.createSheet(month[indexOfMonth]);
		int row = 0;

		int[] sumDay29 = new int[dayOfMonth29[indexOfMonth] + 1];
		int[] sumDay28 = new int[dayOfMonth29[indexOfMonth] + 1];

		// ลาป่วย
		CellStyle colorYellow = workbook.createCellStyle();
		colorYellow.setFillForegroundColor(IndexedColors.YELLOW.getIndex());
		colorYellow.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		colorYellow.setWrapText(true);
		colorYellow.setVerticalAlignment(VerticalAlignment.TOP);

		// ลาพักผ่อน
		CellStyle colorGreen = workbook.createCellStyle();

		colorGreen.setFillForegroundColor(IndexedColors.LIGHT_GREEN.getIndex());
		colorGreen.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		colorGreen.setWrapText(true);
		colorYellow.setVerticalAlignment(VerticalAlignment.TOP);

		// ลากิจ
		CellStyle colorLIGHT_BLUE = workbook.createCellStyle();
		colorLIGHT_BLUE.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
		colorLIGHT_BLUE.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		colorLIGHT_BLUE.setWrapText(true);
		colorYellow.setVerticalAlignment(VerticalAlignment.TOP);

		// ลาสมรส
		CellStyle colorPink = workbook.createCellStyle();
		colorPink.setFillForegroundColor(IndexedColors.PINK1.getIndex());
		colorPink.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		colorPink.setWrapText(true);
		colorYellow.setVerticalAlignment(VerticalAlignment.TOP);
		
		// อื่นๆ
		CellStyle colorOther = workbook.createCellStyle();
		colorOther.setFillForegroundColor(IndexedColors.LIGHT_ORANGE.getIndex());
		colorOther.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		colorOther.setWrapText(true);
		colorOther.setVerticalAlignment(VerticalAlignment.TOP);
		

		CellStyle colorRED = workbook.createCellStyle();
		colorRED.setFillForegroundColor(IndexedColors.RED.getIndex());
		colorRED.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		colorRED.setWrapText(true);
		colorYellow.setVerticalAlignment(VerticalAlignment.TOP);

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
		cellHeaderStyle.setFillForegroundColor(IndexedColors.LIGHT_CORNFLOWER_BLUE.getIndex());
		cellHeaderStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		// ------------------------------------------------------------------//

		int status;
		URL url = new URL("http://localhost:8080/workTimeAPI/reports/getDailyReport/"+getMonth+"/"+getYear+"");
		HttpURLConnection connection = null;
		Connection myConn = null;
		Statement myStmt = null;
		ResultSet myRs = null;

		List<String> enpNo = new ArrayList<String>();
		List<String> nameList = new ArrayList<String>();
		List<String> lastname = new ArrayList<String>();

		try {
			// 1 connect database ดึงข้อมูลพนักงาน ได้แก่ empNo firstname lastname
			myConn = DriverManager.getConnection("jdbc:mysql://localhost:3306/worktime", "root", "1234");

			// 2. Create a statement
			myStmt = myConn.createStatement();

			// 3. Execute SQL query
			myRs = myStmt.executeQuery("select * from employee WHERE employee_no NOT LIKE 't%'");

			// 4. Process the result set
			while (myRs.next()) {
				enpNo.add(myRs.getString("employee_no"));
				nameList.add(myRs.getString("firstname"));
				lastname.add(myRs.getString("lastname"));

			}
			// 2 เปิด connection URL
			connection = (HttpURLConnection) url.openConnection();
			connection.connect();
			// 3 get Status Code
			status = connection.getResponseCode();

			String line;
			// 4 ถ้า Status 200 ให้ทำการ READ ข้อมูล ใน URL โดยใช้ BufferedRead อ่าน
			if (status == 200) {
				BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream()));
				StringBuilder sb = new StringBuilder();
				// 5. นำข้อมูลจากการอ่านมา Loop เก็บในตัว แปร Line
				while ((line = br.readLine()) != null) {
					// 6. ใช้ StringBuilder สำหรับเก็บ ข้อมูล ในตัวแปร line
					sb.append(line + "\n");

				}
				br.close();
				// 7. ข้อมูลที่ได้มาอยู่ในรูปแบบ JSON {}

				// header
				XSSFRow rows = sheet.createRow(0); // ROW 1
				XSSFCell cell0 = rows.createCell(0);
				cell0.setCellValue("วันที่");
				if (year % 4 == 0) {
					for (int index = 0; index < dayOfMonth29[indexOfMonth]; index++) {
						calendarDate.set(Calendar.YEAR, year);
						calendarDate.set(Calendar.MONTH, indexOfMonth);
						calendarDate.set(Calendar.DAY_OF_MONTH, index);
						Date date2 = calendarDate.getTime();
						dayOfCalendar.setTime(date2);
						int dayOfWeek = dayOfCalendar.get(Calendar.DAY_OF_WEEK);
						String nameOfDay = "";
						XSSFCell dayCell = rows.createCell(index + 1);
						dayCell.setCellValue(index + 1);
						sheet.setColumnWidth(index, 25 * 250);
						sheet.setAutoFilter(new CellRangeAddress(0, 0, 0, index + 1));
						sheet.createFreezePane(0, 1);
						dayCell.setCellStyle(cellHeaderStyle);
					}
				} else {
					for (int index = 0; index < dayOfMonth29[indexOfMonth]; index++) {
						calendarDate.set(Calendar.YEAR, year);
						calendarDate.set(Calendar.MONTH, indexOfMonth);
						calendarDate.set(Calendar.DAY_OF_MONTH, index);
						Date date2 = calendarDate.getTime();
						dayOfCalendar.setTime(date2);
						int dayOfWeek = dayOfCalendar.get(Calendar.DAY_OF_WEEK);
						String nameOfDay = "";
						XSSFCell dayCell = rows.createCell(index + 1);
						dayCell.setCellValue(index + 1);
						sheet.setColumnWidth(index, 25 * 250);
						sheet.setAutoFilter(new CellRangeAddress(0, 0, 0, index + 1));
						sheet.createFreezePane(0, 1);
						dayCell.setCellStyle(cellHeaderStyle);
					}
				}

				// ----------------------------------------------------------------------------//
				Map<String, List<String>> leaveMaps = new HashMap<String, List<String>>();
				
				for (int j = 0; j < enpNo.size(); j++) {

					JSONObject idObject = new JSONObject(sb.toString());
					JSONObject jsonKey = new JSONObject(idObject.get(enpNo.get(j)).toString());
					JSONArray jsonArray = (JSONArray) jsonKey.get("data");
					
					String empName = nameList.get(j) + " " + lastname.get(j);
					
					
					if (jsonArray.length() > 0) {
						for (int k = 0; k < jsonArray.length(); k++) {
							JSONObject jsonObject2 = (JSONObject) jsonArray.get(k);
							String typeLeave = jsonObject2.getString("type");
							//System.out.println(type);
							String dateString = jsonObject2.get("start").toString();
							Date startDate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX").parse(dateString);
							String dateKey = new SimpleDateFormat("yyyyMMdd").format(startDate);
							if (leaveMaps.containsKey(dateKey)) {
								List<String> emplist = leaveMaps.get(dateKey);
								emplist.add("/"+empName+","+typeLeave);
								
							} else {
								List<String> emplist = new ArrayList<>();
								emplist.add("/"+empName+","+typeLeave);
								leaveMaps.put(dateKey, emplist);
							}
						}

					}

				} 
				//System.out.println(leaveMaps);
				String keyD;
				String y = getYear.toString();
				String m = getMonth.toString();
				List<Integer> maxRow = new ArrayList<Integer>();
				int maxRowDay=0;
				
				for (int columnIndex = 1; columnIndex <= 31; columnIndex++) {
					if (columnIndex < 10) {
						keyD = y + m + "0" + columnIndex;
					} else {
						keyD = y + m + columnIndex;
					} 
					List<String> mapsDay = leaveMaps.get(keyD);

					if (mapsDay != null) {
						for (int rowIndex = 0; rowIndex < mapsDay.size(); rowIndex++) { 
							String nameLeave =mapsDay.get(rowIndex);
							//cut select type
							//System.out.println(nameLeave.substring(nameLeave.indexOf(",")+1));
							String type = nameLeave.substring(nameLeave.indexOf(",")+1).toString();
							nameLeave=nameLeave.substring(nameLeave.indexOf("/")+1,nameLeave.indexOf(","));
							XSSFRow rowD = sheet.getRow(rowIndex + 1);
							
							if (rowD == null) {
								rowD = sheet.createRow(rowIndex + 1);
							}
							
							Cell celldata = rowD.createCell(columnIndex);
							switch (type) {
							 	case "VACA":
							 	celldata.setCellStyle(colorGreen);
								 celldata.setCellValue(nameLeave);
								break;
							 	case "SICK":
								 celldata.setCellStyle(colorYellow);
								 celldata.setCellValue(nameLeave);
								break;
							 	case "PERS":
								 celldata.setCellStyle(colorLIGHT_BLUE);
								 celldata.setCellValue(nameLeave);
								 break;
								 
							 	case "MARR": 
								 celldata.setCellStyle(colorPink);
								 celldata.setCellValue(nameLeave);
								 break;
								default: 
									celldata.setCellStyle(colorOther);
									 celldata.setCellValue(nameLeave);
									break;
						 }
							 
							if(rowIndex==(mapsDay.size()-1)) {
								if(maxRowDay<rowIndex) {
									maxRowDay=rowIndex+1;
								}
								
								maxRow.add(rowIndex+1);
							}
						}
						
					}else {
						maxRow.add(0);
					}
					
	
				} 
			//set label
					
						XSSFRow rowLabel1 = sheet.getRow(2);
						Cell cellLabel1 = rowLabel1.createCell(0);
						cellLabel1.setCellStyle(colorGreen);
						cellLabel1.setCellValue("ลาพักผ่อน");
						
						XSSFRow rowLabel2 = sheet.getRow(3);
						Cell cellLabel2 = rowLabel2.createCell(0);
						cellLabel2.setCellStyle(colorLIGHT_BLUE);
						cellLabel2.setCellValue("ลากิจ");
						
						XSSFRow rowLabel3 = sheet.getRow(4);
						Cell cellLabel3 = rowLabel3.createCell(0);
						cellLabel3.setCellStyle(colorYellow);
						cellLabel3.setCellValue("ลาป่วย");
						
						XSSFRow rowLabel4 = sheet.getRow(5);
						Cell cellLabel4 = rowLabel4.createCell(0);
						cellLabel4.setCellStyle(colorPink);
						cellLabel4.setCellValue("ลาสมรส");
						
						XSSFRow rowLabel6 = sheet.getRow(6);
						Cell cellLabel6 = rowLabel6.createCell(0);
						cellLabel6.setCellStyle(colorOther);
						cellLabel6.setCellValue("อื่นๆ");
						
			for(int columnMax=0;columnMax<maxRow.size();columnMax++) {
					if(maxRowDay>7) {
						XSSFRow rowMaxD = sheet.getRow(maxRowDay);
						Cell cellDataMax = rowMaxD.createCell(columnMax);
						if ((columnMax)==0) {
							cellDataMax.setCellValue("รวมทั้งหมด");
						}else {
							cellDataMax.setCellValue(maxRow.get(columnMax-1));
						}
					}else {
						XSSFRow rowMaxD = sheet.getRow(8);
						Cell cellDataMax = rowMaxD.createCell(columnMax);
						if ((columnMax)==0) {
							cellDataMax.setCellStyle(colorLIGHT_BLUE);
							cellDataMax.setCellValue("รวมทั้งหมด");
													
						}else {
							cellDataMax.setCellStyle(colorLIGHT_BLUE);
							cellDataMax.setCellValue(maxRow.get(columnMax-1));
								
						}
					}
				}
		
				//System.out.println(leaveMaps.get(keyD));
				

	       
			

			} else {
				System.out.println("{}");
			}

//			FileOutputStream outputStream = new FileOutputStream(".\\datafiles\\report.xlsx");
//			workbook.write(outputStream);
//			outputStream.close();
//
//			System.out.println("Employee.xls is Create Success :");
			
			
			
		} catch (Exception e) {
			e.printStackTrace();
			myConn.close();
			myRs.close();
			myStmt.close();
		}
		
		
		
		
		ByteArrayOutputStream result = new ByteArrayOutputStream();
		workbook.write(result);

		HttpHeaders headers = new HttpHeaders();
		headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=leaveEmployee" + getYear + ".xlsx");
		headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
		headers.add("Pragma", "no-cache");
		headers.add("Expires", "0");
		ByteArrayResource resource = new ByteArrayResource(result.toByteArray());

		return ResponseEntity.ok().headers(headers).contentLength(result.toByteArray().length)
				.contentType(MediaType.APPLICATION_OCTET_STREAM).body(resource);
		
		
		
	}
       
}


