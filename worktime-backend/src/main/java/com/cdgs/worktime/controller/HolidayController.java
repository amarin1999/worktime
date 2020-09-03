package com.cdgs.worktime.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.tempuri.ISWebService.ISService.Holiday;
import org.tempuri.ISWebService.ISService.ISServiceSoapProxy;

import com.cdgs.worktime.dto.holidayDto;

import lombok.extern.slf4j.Slf4j;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/holiday")
@Slf4j
public class HolidayController {

	@GetMapping(path = "/{month}/{year}/{empNo}")
	private ResponseEntity<ArrayList<holidayDto>> getHoliday(@PathVariable(value = "month") Integer month,
			@PathVariable(value = "year") Integer year, @PathVariable(value = "empNo") String empNo) {
		try {
			Locale LOCALE_TH = new Locale("th", "TH");
//			SimpleDateFormat convertDateTH = new SimpleDateFormat("dd/MM/yyyy", LOCALE_TH);
//			SimpleDateFormat convertTimePrint = new SimpleDateFormat("HH:mm");
//			SimpleDateFormat convertShowSatSun = new SimpleDateFormat("E", Locale.US);
//			SimpleDateFormat convertDateNameFolder = new SimpleDateFormat("yyyyMMdd-HHmm", LOCALE_TH);
			SimpleDateFormat convertDateToCallService = new SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH);

			Calendar calendar = Calendar.getInstance(Locale.ENGLISH);
			calendar.set(Calendar.DATE, 1); 
			calendar.set(Calendar.MONTH, month - 1);
			calendar.set(Calendar.YEAR, year);

			calendar.set(Calendar.SECOND, 0); 
			calendar.set(Calendar.HOUR, 0); 
			calendar.set(Calendar.MINUTE, 0); 
			calendar.set(Calendar.MILLISECOND, 0);

			Date startDate = calendar.getTime();
			calendar.add(Calendar.MONTH, +1);
			calendar.add(Calendar.DATE, -1);

			Date endDate = calendar.getTime();
			String convertTextDateStart = convertDateToCallService.format(startDate);
			String convertTextDateEnd = convertDateToCallService.format(endDate);

			ISServiceSoapProxy ispo = new ISServiceSoapProxy();
			Holiday[] holidayResults = ispo.getISServiceSoap().getHoliday(empNo, convertTextDateStart,convertTextDateEnd);							
			
			ArrayList<holidayDto> holidays = new ArrayList<holidayDto>();
			for (Holiday holidayResult : holidayResults) {
				holidays.add(new holidayDto(holidayResult.getHolidayDate(), holidayResult.getHolidayEngName()));		
			}
			return new ResponseEntity<ArrayList<holidayDto>>(holidays, HttpStatus.OK);
		} catch (Exception e) {
			log.error(e.getMessage());
			return new ResponseEntity<ArrayList<holidayDto>>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
