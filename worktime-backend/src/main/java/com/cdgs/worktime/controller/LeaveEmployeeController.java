package com.cdgs.worktime.controller;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.tempuri.ISWebService.ISService.ISServiceSoapProxy;
import org.tempuri.ISWebService.ISService.LeaveInformation;

import com.cdgs.worktime.dto.EmployeeDto;
import com.cdgs.worktime.dto.LeaveEmployeeDto;
import com.cdgs.worktime.util.ResponseDto;
import com.google.api.client.json.Json;

@RestController
@CrossOrigin(origins= "*", maxAge =3600)
@RequestMapping("/getLeaveEmployee")
public class LeaveEmployeeController {
	EmployeeDto employeeDto ;
	@GetMapping("/{year}/{empNo}")
	private ResponseEntity<ResponseDto<LeaveEmployeeDto>> getLeaveEmployee(
			@PathVariable(value ="year")Integer year,
			@PathVariable(value = "empNo") String empNo)
		{
		
		StringBuilder stringBuilder = new StringBuilder();
		ResponseDto<LeaveEmployeeDto> res = new ResponseDto<LeaveEmployeeDto>();
		try {
			Locale LOCALE_TH = new Locale("th","TH");
			SimpleDateFormat converDateCallService = new SimpleDateFormat("yyyy-MM-dd",Locale.ENGLISH);
			
			Calendar calendar = Calendar.getInstance(Locale.ENGLISH);
			ArrayList<LeaveEmployeeDto> leaveEmployeeList = new ArrayList<LeaveEmployeeDto>();
			
			calendar.set(Calendar.DATE, 1);
			calendar.set(Calendar.MONTH, 0);
			calendar.set(Calendar.YEAR, year);

			calendar.set(Calendar.SECOND, 0);
			calendar.set(Calendar.HOUR, 0);
			calendar.set(Calendar.MINUTE, 0);
			calendar.set(Calendar.MILLISECOND, 0);

			Date startDate = calendar.getTime();

			calendar.add(Calendar.MONTH, 12);
			calendar.add(Calendar.DATE, -1);
			
			Date enDate =  calendar.getTime();
			
			String convertTextDateStart = converDateCallService.format(startDate);
			String converTextSDateEnd  = converDateCallService.format(enDate);
			long start = System.currentTimeMillis();
			ISServiceSoapProxy  ispo = new ISServiceSoapProxy();
			LeaveInformation[] leaveEmployeeResults = ispo.getISServiceSoap().getLeave(empNo, convertTextDateStart, 
					converTextSDateEnd);
			long end =  System.currentTimeMillis();
			System.out.println("time : "+ (end-start));
			SimpleDateFormat leaveDate  = new SimpleDateFormat("yyyy-MM-dd");
			StringBuffer stringBuffer = new StringBuffer();
			for (LeaveInformation leaveEmployeeResult : leaveEmployeeResults) {
				String leaveName = "";
				
				leaveName = leaveEmployeeResult.getLeaveInformation();
				leaveEmployeeList.add(new LeaveEmployeeDto(leaveName, leaveDate.parse(leaveEmployeeResult.getLeaveDate()),leaveEmployeeResult.getLeaveType()));
				
				
			}
			System.out.println(stringBuffer);
			
			res.setResult(ResponseDto.RESPONSE_RESULT.Success.getRes());
			res.setData(leaveEmployeeList);
			res.setCode(201);
			return new ResponseEntity<ResponseDto<LeaveEmployeeDto>>(res,HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			res.setResult(ResponseDto.RESPONSE_RESULT.Success.getRes());
			res.setErrorMessage(e.getMessage());
			res.setCode(201);	
			return new ResponseEntity<ResponseDto<LeaveEmployeeDto>>(res,HttpStatus.OK);
		}
		
	}
	
	
	
	@GetMapping("/{month}/{year}/{empNo}")
	private ResponseEntity<ResponseDto<LeaveEmployeeDto>> getLeaveEmployeByday(
			@PathVariable(value ="month") Integer getmonth,
			@PathVariable(value ="year")Integer year,
			@PathVariable(value = "empNo") String empNo)
		{
		
		StringBuilder stringBuilder = new StringBuilder();
		ResponseDto<LeaveEmployeeDto> res = new ResponseDto<LeaveEmployeeDto>();
		try {
			Locale LOCALE_TH = new Locale("th","TH");
			SimpleDateFormat converDateCallService = new SimpleDateFormat("yyyy-MM-dd",Locale.ENGLISH);
				
			Calendar calendar = Calendar.getInstance(Locale.ENGLISH);
			ArrayList<LeaveEmployeeDto> leaveEmployeeList = new ArrayList<LeaveEmployeeDto>();
			
			calendar.set(Calendar.DATE, 1);
			calendar.set(Calendar.MONTH, getmonth-1);
			calendar.set(Calendar.YEAR, year);

			calendar.set(Calendar.SECOND, 0);
			calendar.set(Calendar.HOUR, 7);
			calendar.set(Calendar.MINUTE, 0);
			calendar.set(Calendar.MILLISECOND, 0);

			Date startDate = calendar.getTime();	
			
			calendar.set(Calendar.MONTH, getmonth-1);
			calendar.set(Calendar.YEAR, year);
			calendar.set(Calendar.DATE, 31);
				
			Date enDate =  calendar.getTime();
			
			String convertTextDateStart = converDateCallService.format(startDate);
			String converTextSDateEnd  = converDateCallService.format(enDate);
			long start = System.currentTimeMillis();
			ISServiceSoapProxy  ispo = new ISServiceSoapProxy();
			LeaveInformation[] leaveEmployeeResults = ispo.getISServiceSoap().getLeave(empNo, convertTextDateStart, 
					converTextSDateEnd);
			long end =  System.currentTimeMillis();
			System.out.println("time : "+ (end-start)); 
			SimpleDateFormat leaveDate  = new SimpleDateFormat("yyyy-MM-dd");
			StringBuffer stringBuffer = new StringBuffer();
			for (LeaveInformation leaveEmployeeResult : leaveEmployeeResults) {
				String leaveName = "";
				leaveName = leaveEmployeeResult.getLeaveInformation();
				leaveEmployeeList.add(new LeaveEmployeeDto(leaveName, leaveDate.parse(leaveEmployeeResult.getLeaveDate()),leaveEmployeeResult.getLeaveType()));

			}
			System.out.println(stringBuffer);
			
			res.setResult(ResponseDto.RESPONSE_RESULT.Success.getRes());
			res.setData(leaveEmployeeList);
			res.setCode(201);
			return new ResponseEntity<ResponseDto<LeaveEmployeeDto>>(res,HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			res.setResult(ResponseDto.RESPONSE_RESULT.Success.getRes());
			res.setErrorMessage(e.getMessage());
			res.setCode(201);
			return new ResponseEntity<ResponseDto<LeaveEmployeeDto>>(res,HttpStatus.OK);
		}
		
	}


}
