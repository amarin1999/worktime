package com.cdgs.worktime.service;

import java.util.List;

import javax.validation.Valid;

import com.cdgs.worktime.dto.CheckAuthenDto;
import com.cdgs.worktime.dto.EmployeeByDayDto;
import com.cdgs.worktime.dto.EmployeeDayDto;
import com.cdgs.worktime.dto.EmployeeDto;
import com.cdgs.worktime.entity.EmployeeEntity;
import com.sun.el.parser.ParseException;

public interface EmployeeService {

	boolean checkAuthenEmployee(CheckAuthenDto body);
	List<EmployeeDto> getEmployeeByNo(String no);
	List<EmployeeDto> getEmployeeAll();
	List<EmployeeByDayDto> getEmployeeByDay(String year, String month, String day, Long work);
	List<EmployeeByDayDto> getEmployeeAllByDay(String year, String month, String day);
	List<EmployeeDto> getEmployeeByAccessReport(String accessReport);
	EmployeeDto updateEmployeeName(Long id, EmployeeDto body);
	EmployeeDto putEmployeeAccess(EmployeeDto body);
	

}
