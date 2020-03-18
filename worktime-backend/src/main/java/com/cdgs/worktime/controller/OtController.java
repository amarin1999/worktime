package com.cdgs.worktime.controller;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdgs.worktime.dto.OtDto;
import com.cdgs.worktime.dto.OtPostTimeDto;
import com.cdgs.worktime.util.ResponseDto;

import lombok.extern.slf4j.Slf4j;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping(path = "/overtime")
@Slf4j
public class OtController {

	@PostMapping(path="/posttime")
	private ResponseEntity<ResponseDto<OtDto>> postOt(@Valid @RequestBody OtPostTimeDto body){
		System.out.println(body);
		return null;
		
	}
}
