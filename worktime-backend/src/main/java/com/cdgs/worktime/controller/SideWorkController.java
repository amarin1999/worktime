package com.cdgs.worktime.controller;

import java.util.ArrayList;
import java.util.List;

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
import org.springframework.web.bind.annotation.RestController;

import com.cdgs.worktime.dto.EmployeeDto;
import com.cdgs.worktime.dto.EmployeeHasSideworkHistoryDto;
import com.cdgs.worktime.dto.SideworkHistoryDto;
import com.cdgs.worktime.service.EmployeeService;
import com.cdgs.worktime.service.SideWorkService;
import com.cdgs.worktime.util.ResponseDto;

import lombok.extern.slf4j.Slf4j;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/sidework")
@Slf4j
public class SideWorkController {

	@Autowired()
	SideWorkService sideworkservice;
	EmployeeService employeeservice;

	@GetMapping(path = "/getsideworkbyid/{id}")
	public ResponseEntity<ResponseDto<SideworkHistoryDto>> getSideWorkById(@PathVariable("id") Long id) {
		List<SideworkHistoryDto> dto = new ArrayList<>();
		ResponseDto<SideworkHistoryDto> res = new ResponseDto<>();
		try {
			dto = sideworkservice.getSideWorkById(id);
			res.setResult(ResponseDto.RESPONSE_RESULT.Success.getRes());
			res.setData(dto);
			res.setCode(200);
			if (dto.size() == 0) {
				res.setResult(ResponseDto.RESPONSE_RESULT.Fail.getRes());
				res.setData(dto);
				res.setCode(404);
				return new ResponseEntity<ResponseDto<SideworkHistoryDto>>(res, HttpStatus.NOT_FOUND);

			}
			return new ResponseEntity<ResponseDto<SideworkHistoryDto>>(res, HttpStatus.OK);
		} catch (Exception e) {
			res.setResult(ResponseDto.RESPONSE_RESULT.Fail.getRes());
			res.setData(dto);
			res.setCode(400);
			return new ResponseEntity<ResponseDto<SideworkHistoryDto>>(res, HttpStatus.BAD_REQUEST);
		}

	}

	@PostMapping(path = "/postname/{id}")
	public ResponseEntity<ResponseDto<EmployeeDto>> postTitleName(@Valid @RequestBody EmployeeDto body ,@PathVariable("id") Long id) {
		ResponseDto<EmployeeDto> res = new ResponseDto<EmployeeDto>();
		List<EmployeeDto> locations = new ArrayList<EmployeeDto>();
		EmployeeDto location = new EmployeeDto();
		try {
			location = employeeservice.updateEmployeeName(id, body);
			if (location != null) {
				locations.add(location);
			}
			res.setResult(ResponseDto.RESPONSE_RESULT.Success.getRes());
			res.setData(locations);
			res.setCode(200);
			return new ResponseEntity<ResponseDto<EmployeeDto>>(res, HttpStatus.OK);
		} catch (Exception e) {
			log.error("postName ", e);
			res.setResult(ResponseDto.RESPONSE_RESULT.Fail.getRes());
			res.setErrorMessage(e.getMessage());
			res.setCode(400);
			return new ResponseEntity<ResponseDto<EmployeeDto>>(res, HttpStatus.BAD_REQUEST);
		}
		
	}

	@PostMapping(path = "/posttime")
	public ResponseEntity<ResponseDto<SideworkHistoryDto>> postSideWorkTime(
			@Valid @RequestBody SideworkHistoryDto body) {
		List<SideworkHistoryDto> dto = new ArrayList<SideworkHistoryDto>();
		ResponseDto<SideworkHistoryDto> res = new ResponseDto<SideworkHistoryDto>();
		SideworkHistoryDto sideTime = new SideworkHistoryDto();
		try {
			sideTime = sideworkservice.postSideWorkTime(body);
			if (sideTime != null) {
				dto.add(sideTime);
			}
			res.setResult(ResponseDto.RESPONSE_RESULT.Success.getRes());
			res.setData(dto);
			res.setCode(200);
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