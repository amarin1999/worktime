package com.cdgs.worktime.service;

import java.util.List;

import com.cdgs.worktime.dto.EmployeeByDayDto;
import com.cdgs.worktime.dto.EmployeeDayDto;
import com.cdgs.worktime.dto.EmployeeDto;
import com.cdgs.worktime.entity.EmployeeEntity;

public interface EmployeeService {

	List<EmployeeDto> getEmployeeByNo(String no);
	List<EmployeeDto> getEmployeeAll();
	List<EmployeeByDayDto> getEmployeeByDay(String year, String month, String day, Long work);
	List<EmployeeByDayDto> getEmployeeAllByDay(String year, String month, String day);
	EmployeeDto updateEmployeeName(Long id, EmployeeDto body);
	

}
