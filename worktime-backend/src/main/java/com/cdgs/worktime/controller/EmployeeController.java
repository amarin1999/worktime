package com.cdgs.worktime.controller;

import java.io.Console;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdgs.worktime.dto.EmployeeDto;
import com.cdgs.worktime.service.EmployeeService;
import com.cdgs.worktime.util.ResponseDto;

import lombok.extern.slf4j.Slf4j;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/getEmployee")
@Slf4j
public class EmployeeController {

	@Autowired
	EmployeeService employeeService;

	@GetMapping(path = "/{no}")
	public ResponseEntity<ResponseDto<EmployeeDto>> getUsers(@PathVariable(value = "no") String employeeNo) {
		ResponseDto<EmployeeDto> res = new ResponseDto<>();
		List<EmployeeDto> dto = new ArrayList<EmployeeDto>();

		try {
			dto = employeeService.getEmployeeByNo(employeeNo);
			res.setResult(ResponseDto.RESPONSE_RESULT.Success.getRes());
			res.setData(dto);
			res.setCode(200);
			if (dto.size() == 0) {
				res.setResult(ResponseDto.RESPONSE_RESULT.Fail.getRes());
				res.setErrorMessage("ไม่พบข้อมูลผู้ใช้");
				res.setData(dto);
				res.setCode(404);
				return new ResponseEntity<ResponseDto<EmployeeDto>>(res, HttpStatus.NOT_FOUND);

			}
			return new ResponseEntity<ResponseDto<EmployeeDto>>(res, HttpStatus.OK);
		} catch (Exception e) {
			log.error(e.getMessage());
			res.setResult(ResponseDto.RESPONSE_RESULT.Fail.getRes());
			res.setErrorMessage(e.getMessage());
			res.setCode(404);
			return new ResponseEntity<ResponseDto<EmployeeDto>>(res, HttpStatus.BAD_REQUEST);
		}
	}

}
