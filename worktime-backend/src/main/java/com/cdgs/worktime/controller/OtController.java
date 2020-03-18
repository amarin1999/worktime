package com.cdgs.worktime.controller;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdgs.worktime.dto.EmployeeDto;
import com.cdgs.worktime.dto.EmployeeHasSideworkHistoryDto;
import com.cdgs.worktime.dto.OtHistoryDto;
import com.cdgs.worktime.dto.OtPostTimeDto;
import com.cdgs.worktime.dto.SideworkHistoryDto;
import com.cdgs.worktime.service.EmployeeHasSideworkHistoryService;
import com.cdgs.worktime.service.EmployeeService;
import com.cdgs.worktime.service.OtService;
import com.cdgs.worktime.util.ResponseDto;

import lombok.extern.slf4j.Slf4j;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/overtime")
@Slf4j
public class OtController {

	EmployeeService employeeService;
	EmployeeHasSideworkHistoryService employeeHasSideworkService;
	OtService otService;
	


	public OtController(EmployeeService employeeService, EmployeeHasSideworkHistoryService employeeHasSideworkService,
			OtService otService) {
		super();
		this.employeeService = employeeService;
		this.employeeHasSideworkService = employeeHasSideworkService;
		this.otService = otService;
	}



	@PostMapping(path="/posttime")
	private ResponseEntity<ResponseDto<OtHistoryDto>> postOtTime(@Valid @RequestBody OtPostTimeDto body){
		ResponseDto<OtHistoryDto> res =new ResponseDto<OtHistoryDto>();
		List<EmployeeDto> employeeData = employeeService.getEmployeeByNo(body.getEmployeeNo());
		List<OtHistoryDto> dto =new ArrayList<OtHistoryDto>();
		OtHistoryDto data =new OtHistoryDto();
		EmployeeHasSideworkHistoryDto employeeHasSideworkData = employeeHasSideworkService.getEmployeeHasHistory(employeeData,(long) 2);
		
		try {
			data = otService.postOtTime(body,employeeHasSideworkData);
			dto.add(data);
			res.setResult(ResponseDto.RESPONSE_RESULT.Success.getRes());
			res.setCode(201);
			return new ResponseEntity<ResponseDto<OtHistoryDto>>(res,HttpStatus.ACCEPTED);
		}catch (Exception e) {
			log.error("otpostTime ", e);
			res.setResult(ResponseDto.RESPONSE_RESULT.Fail.getRes());
			res.setErrorMessage(e.getMessage());
			res.setCode(400);
			return new ResponseEntity<ResponseDto<OtHistoryDto>>(res,HttpStatus.BAD_REQUEST);
		}
		
		
	}
}
