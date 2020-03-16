package com.cdgs.worktime.service;

import java.util.Date;
import java.util.List;

import com.cdgs.worktime.dto.EmployeeDto;
import com.cdgs.worktime.dto.EmployeeHasSideworkHistoryDto;
import com.cdgs.worktime.dto.SideWorkPostTimeDto;
import com.cdgs.worktime.dto.SideworkHistoryDto;

public interface SideWorkService {

	List<SideworkHistoryDto> getSideWorkById(Long id);

	EmployeeDto postEmployeeName(EmployeeDto employeeName);
	

	SideworkHistoryDto postSideWorkTime(SideWorkPostTimeDto sideTime, EmployeeHasSideworkHistoryDto employee);
	
	SideworkHistoryDto getSideWorkTime(String string,Long employeeId );
}
