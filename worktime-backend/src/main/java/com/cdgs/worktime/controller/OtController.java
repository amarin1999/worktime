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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdgs.worktime.dto.EmployeeDto;
import com.cdgs.worktime.dto.EmployeeHasSideworkHistoryDto;
import com.cdgs.worktime.dto.OtHistoryDto;
import com.cdgs.worktime.dto.OtNoListDto;
import com.cdgs.worktime.dto.OtPostTimeDto;
import com.cdgs.worktime.dto.OtPutTimeDto;
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

	@PostMapping(path = "/posttime")
	private ResponseEntity<ResponseDto<OtHistoryDto>> postOtTime(@Valid @RequestBody OtPostTimeDto body) {
		ResponseDto<OtHistoryDto> res = new ResponseDto<OtHistoryDto>();
		List<EmployeeDto> employeeData = employeeService.getEmployeeByNo(body.getEmployeeNo());
		List<OtHistoryDto> dto = new ArrayList<OtHistoryDto>();
		OtHistoryDto data = new OtHistoryDto();

		EmployeeHasSideworkHistoryDto employeeHasSideworkData = employeeHasSideworkService
				.postEmployeeHasHistory(employeeData.get(0).getId(), (long) 2);

		try {
			data = otService.postOtTime(body, employeeHasSideworkData);
			dto.add(data);
			res.setResult(ResponseDto.RESPONSE_RESULT.Success.getRes());
			res.setCode(201);
			return new ResponseEntity<ResponseDto<OtHistoryDto>>(res, HttpStatus.ACCEPTED);
		} catch (Exception e) {
			log.error("otpostTime ", e);
			res.setResult(ResponseDto.RESPONSE_RESULT.Fail.getRes());
			res.setErrorMessage(e.getMessage());
			res.setCode(400);
			return new ResponseEntity<ResponseDto<OtHistoryDto>>(res, HttpStatus.BAD_REQUEST);
		}

	}

	@GetMapping(path = "/gettime")
	private ResponseEntity<ResponseDto<OtNoListDto>> getOtTime(@PathVariable(value = "id") Long id) {
		ResponseDto<OtNoListDto> res = new ResponseDto<OtNoListDto>();
		List<OtNoListDto> dto = new ArrayList<OtNoListDto>();

		try {
			OtNoListDto data = otService.getOtTime(id);
			dto.add(data);

			res.setResult(ResponseDto.RESPONSE_RESULT.Success.getRes());
			res.setData(dto);
			res.setCode(200);
			return new ResponseEntity<ResponseDto<OtNoListDto>>(res, HttpStatus.ACCEPTED);
		} catch (Exception e) {

			log.error("otgetTime ", e);
			res.setResult(ResponseDto.RESPONSE_RESULT.Fail.getRes());
			res.setErrorMessage(e.getMessage());
			res.setCode(400);
			return new ResponseEntity<ResponseDto<OtNoListDto>>(res, HttpStatus.BAD_REQUEST);
		}

	}

	@PutMapping(path = "/puttime")
	private ResponseEntity<ResponseDto<OtHistoryDto>> putOtTime(@Valid @RequestBody OtPutTimeDto body) {
		ResponseDto<OtHistoryDto> res = new ResponseDto<OtHistoryDto>();
		List<OtHistoryDto> dto = new ArrayList<OtHistoryDto>();
		OtHistoryDto data = new OtHistoryDto();

		try {
			data = otService.putOtTime(body);
			dto.add(data);
			res.setResult(ResponseDto.RESPONSE_RESULT.Success.getRes());
			res.setData(dto);
			res.setCode(201);
			return new ResponseEntity<ResponseDto<OtHistoryDto>>(res, HttpStatus.ACCEPTED);
		} catch (Exception e) {
			log.error("otputTime ", e);
			res.setResult(ResponseDto.RESPONSE_RESULT.Fail.getRes());
			res.setErrorMessage(e.getMessage());
			res.setCode(400);
			return new ResponseEntity<ResponseDto<OtHistoryDto>>(res, HttpStatus.BAD_REQUEST);
		}
	}
	
	@DeleteMapping(path = "/deletetime/{OtId}")
	private ResponseEntity<ResponseDto<OtNoListDto>> deleteOtTime(@PathVariable(value = "OtId") Long OtId){
		ResponseDto<OtNoListDto> res = new ResponseDto<OtNoListDto>();
		OtNoListDto ot = otService.getOtbyNo(OtId);
		if (ot.getId()!= null) {
			otService.deleteOtTime(OtId);
			res.setResult(ResponseDto.RESPONSE_RESULT.Success.getRes());
			res.setCode(200);
			return new ResponseEntity<ResponseDto<OtNoListDto>>(res, HttpStatus.OK);
		} else {
			res.setResult(ResponseDto.RESPONSE_RESULT.Fail.getRes());
			res.setCode(400);
			return new ResponseEntity<ResponseDto<OtNoListDto>>(res, HttpStatus.BAD_REQUEST);
		}	
	}
	
	
}
