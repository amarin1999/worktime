package com.cdgs.worktime.service;

import java.util.List;

import com.cdgs.worktime.dto.EmployeeDto;

public interface EmployeeService {

	List<EmployeeDto> getEmployeeByNo(String no);
	EmployeeDto updateEmployeeName(Long id, EmployeeDto body);

}
