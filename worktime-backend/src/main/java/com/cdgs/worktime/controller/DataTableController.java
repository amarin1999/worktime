package com.cdgs.worktime.controller;

import java.util.ArrayList;
import java.util.List;

import javax.websocket.server.PathParam;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdgs.worktime.dto.EmployeeDto;
import com.cdgs.worktime.dto.OtNoListDto;
import com.cdgs.worktime.dto.SideworkDateToSting;
import com.cdgs.worktime.dto.SideworkHistoryDto;
import com.cdgs.worktime.service.DataTableService;
import com.cdgs.worktime.service.EmployeeService;
import com.cdgs.worktime.util.ResponseDto;

import lombok.extern.slf4j.Slf4j;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/datatable")
@Slf4j
public class DataTableController {

	EmployeeService employeeService;
	DataTableService dataTableService;
	
	public DataTableController(EmployeeService employeeService, DataTableService dataTableService) {
		super();
		this.employeeService = employeeService;
		this.dataTableService = dataTableService;
	}

	@GetMapping(path = "/getsidework/{no}")
	private ResponseEntity<ResponseDto<SideworkDateToSting>> getSideworkData(
			@PathVariable(value = "no") String employeeNo) {
		
		ResponseDto<SideworkDateToSting> res =new ResponseDto<SideworkDateToSting>();
		List<SideworkDateToSting> dto = new ArrayList<SideworkDateToSting>();
		
		List<EmployeeDto> employee = employeeService.getEmployeeByNo(employeeNo);
	
		try {
			dto=dataTableService.getSideWorkAll(employee.get(0).getId());			
			res.setResult(ResponseDto.RESPONSE_RESULT.Success.getRes());
			res.setData(dto);
			res.setCode(201);
			return new ResponseEntity<ResponseDto<SideworkDateToSting>>(res,HttpStatus.ACCEPTED);
		}catch (Exception e) {
			log.error(e.getMessage());
			res.setResult(ResponseDto.RESPONSE_RESULT.Fail.getRes());
			res.setErrorMessage(e.getMessage());
			res.setCode(400);
			return new ResponseEntity<ResponseDto<SideworkDateToSting>>(res,HttpStatus.BAD_REQUEST);
		}
	}
	
		@GetMapping(path = "/getot/{no}")
		private ResponseEntity<ResponseDto<OtNoListDto>> getOtData(
				@PathVariable(value = "no") String employeeNo) {			
			ResponseDto<OtNoListDto> res =new ResponseDto<OtNoListDto>();
			List<OtNoListDto> dto = new ArrayList<OtNoListDto>();
			List<EmployeeDto> employee = employeeService.getEmployeeByNo(employeeNo);
			
			try {
				dto=dataTableService.getOtAll(employee.get(0).getId());		
				res.setResult(ResponseDto.RESPONSE_RESULT.Success.getRes());
				res.setData(dto);
				res.setCode(201);
				return new ResponseEntity<ResponseDto<OtNoListDto>>(res,HttpStatus.ACCEPTED);
			}catch (Exception e) {
				log.error(e.getMessage());
				res.setResult(ResponseDto.RESPONSE_RESULT.Fail.getRes());
				res.setErrorMessage(e.getMessage());
				res.setCode(400);
				return new ResponseEntity<ResponseDto<OtNoListDto>>(res,HttpStatus.BAD_REQUEST);
			}
				
		
	}

}
