package com.cdgs.worktime.controller;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cdgs.worktime.dto.EmployeeDto;
import com.cdgs.worktime.dto.EmployeeHasSideworkHistoryDto;
import com.cdgs.worktime.dto.SideWorkPostTimeDto;
import com.cdgs.worktime.dto.SideworkHistoryDto;
import com.cdgs.worktime.service.EmployeeHasSideworkHistoryService;
import com.cdgs.worktime.service.EmployeeService;
import com.cdgs.worktime.service.SideWorkService;
import com.cdgs.worktime.util.ResponseDto;

import lombok.extern.slf4j.Slf4j;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/sidework")
@Slf4j
public class SideWorkController {

	SideWorkService sideworkservice;
	EmployeeService employeeservice;
	EmployeeHasSideworkHistoryService employeeHasSideworkHistoryService;

	@Autowired()
	public SideWorkController(SideWorkService sideworkservice, EmployeeService employeeservice,
			EmployeeHasSideworkHistoryService employeeHasSideworkHistoryService) {
		super();
		this.sideworkservice = sideworkservice;
		this.employeeservice = employeeservice;
		this.employeeHasSideworkHistoryService = employeeHasSideworkHistoryService;
	}

	
	

	@GetMapping(path = "/gettime")
	private ResponseEntity<ResponseDto<SideworkHistoryDto>> getSideWorkTime(@RequestParam String no,
			@RequestParam String startTime) throws ParseException {
		ResponseDto<SideworkHistoryDto> res = new ResponseDto<SideworkHistoryDto>();
		List<SideworkHistoryDto> dto = new ArrayList<SideworkHistoryDto>();
		List<EmployeeDto> employee = employeeservice.getEmployeeByNo(no);

		SideworkHistoryDto dataSideWork = sideworkservice.getSideWorkTime(startTime, employee.get(0).getId());
		dto.add(dataSideWork);
		try {
			res.setResult(ResponseDto.RESPONSE_RESULT.Success.getRes());
			res.setData(dto);
			res.setCode(201);
			return new ResponseEntity<ResponseDto<SideworkHistoryDto>>(res, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			log.error("gettime ", e);
			res.setResult(ResponseDto.RESPONSE_RESULT.Fail.getRes());
			res.setErrorMessage(e.getMessage());
			res.setCode(400);
			return new ResponseEntity<ResponseDto<SideworkHistoryDto>>(res, HttpStatus.BAD_REQUEST);
		}

	}

	@PostMapping(path = "/posttime")
	public ResponseEntity<ResponseDto<SideworkHistoryDto>> postSideWorkTime(
			@Valid @RequestBody SideWorkPostTimeDto body) throws ParseException {
		ResponseDto<SideworkHistoryDto> res = new ResponseDto<SideworkHistoryDto>();
		List<SideworkHistoryDto> dto = new ArrayList<SideworkHistoryDto>();
		SideworkHistoryDto data = new SideworkHistoryDto();
		

		DateFormat dateformat = new SimpleDateFormat("yyyy-MM-dd");
		String date = dateformat.format(body.getStartTime());

		EmployeeHasSideworkHistoryDto employeeHasSideWorkHistoryId = new EmployeeHasSideworkHistoryDto();
		List<EmployeeDto> employeeData = new ArrayList<EmployeeDto>();

		employeeData = employeeservice.getEmployeeByNo(body.getEmployeeNo());
		
		try {
			data = sideworkservice.postSideWorkTime(body, employeeData.get(0), date);
			dto.add(data);

			res.setResult(ResponseDto.RESPONSE_RESULT.Success.getRes());
			res.setData(dto);
			res.setCode(201);
			return new ResponseEntity<ResponseDto<SideworkHistoryDto>>(res, HttpStatus.OK);
		} catch (Exception e) {
			log.error("postTime ", e);
			res.setResult(ResponseDto.RESPONSE_RESULT.Fail.getRes());
			res.setErrorMessage(e.getMessage());
			res.setCode(400);
			return new ResponseEntity<ResponseDto<SideworkHistoryDto>>(res, HttpStatus.BAD_REQUEST);
		}
	}

}
