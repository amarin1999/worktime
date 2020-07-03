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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cdgs.worktime.dto.EmployeeDto;
import com.cdgs.worktime.dto.EmployeeHasSideworkHistoryDto;
import com.cdgs.worktime.dto.OtHistoryDto;
import com.cdgs.worktime.dto.OtPutTimeDto;
import com.cdgs.worktime.dto.SideWorkPostTimeDto;
import com.cdgs.worktime.dto.SideWorkPutTimeDto;
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
			@RequestParam String date) throws ParseException {
		ResponseDto<SideworkHistoryDto> res = new ResponseDto<SideworkHistoryDto>();
		List<SideworkHistoryDto> dto = new ArrayList<SideworkHistoryDto>();
		List<EmployeeDto> employee = employeeservice.getEmployeeByNo(no);
//		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		SideworkHistoryDto dataSideWork = sideworkservice.getSideWorkTime(date, employee.get(0).getId());
		if (dataSideWork.getId() != null) {
			res.setResult(ResponseDto.RESPONSE_RESULT.Success.getRes());
			res.setCode(200);
		} else {
			res.setResult(ResponseDto.RESPONSE_RESULT.Fail.getRes());
			res.setCode(404);
		}
		return new ResponseEntity<ResponseDto<SideworkHistoryDto>>(res, HttpStatus.OK);
	}

	@PostMapping(path = "/posttime")
	public ResponseEntity<ResponseDto<SideworkHistoryDto>> postSideWorkTime(
			@Valid @RequestBody SideWorkPostTimeDto body) throws ParseException {
		ResponseDto<SideworkHistoryDto> res = new ResponseDto<SideworkHistoryDto>();
		List<SideworkHistoryDto> dto = new ArrayList<SideworkHistoryDto>();
		SideworkHistoryDto data = new SideworkHistoryDto();

		DateFormat dateformat = new SimpleDateFormat("yyyy-MM-dd");
		String date = dateformat.format(body.getDate());
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
	
	@PutMapping(path = "/puttime")
	private ResponseEntity<ResponseDto<SideworkHistoryDto>> putSideWorkTime(@Valid @RequestBody SideWorkPutTimeDto body) {
		ResponseDto<SideworkHistoryDto> res = new ResponseDto<SideworkHistoryDto>();
		List<SideworkHistoryDto> dto = new ArrayList<SideworkHistoryDto>();
		SideworkHistoryDto data = new SideworkHistoryDto();

		try {
			data = sideworkservice.putSideWorkTime(body);
			dto.add(data); 
			res.setResult(ResponseDto.RESPONSE_RESULT.Success.getRes());
			res.setData(dto);
			res.setCode(201);
			return new ResponseEntity<ResponseDto<SideworkHistoryDto>>(res, HttpStatus.ACCEPTED);
		} catch (Exception e) {
			log.error("sideworkputtime", e);
			res.setResult(ResponseDto.RESPONSE_RESULT.Fail.getRes());
			res.setErrorMessage(e.getMessage());
			res.setCode(400);
			return new ResponseEntity<ResponseDto<SideworkHistoryDto>>(res, HttpStatus.BAD_REQUEST);
		}
	}
	
	
	
	@DeleteMapping(path = "/deletetime/{sideworkId}")
	private ResponseEntity<ResponseDto<SideworkHistoryDto>> deleteSideWorkTime(@PathVariable(value = "sideworkId") Long sideworkId){
		ResponseDto<SideworkHistoryDto> res = new ResponseDto<SideworkHistoryDto>();
		SideworkHistoryDto sidework = sideworkservice.getSideworkByNo(sideworkId);
		if (sidework.getId()!= null) {
			sideworkservice.deleteSideWorktime(sideworkId);
			res.setResult(ResponseDto.RESPONSE_RESULT.Success.getRes());
			res.setCode(200);
			return new ResponseEntity<ResponseDto<SideworkHistoryDto>>(res, HttpStatus.OK);
		} else {
			res.setResult(ResponseDto.RESPONSE_RESULT.Fail.getRes());
			res.setCode(400);
			return new ResponseEntity<ResponseDto<SideworkHistoryDto>>(res, HttpStatus.BAD_REQUEST);
		}	
			
	}
}
