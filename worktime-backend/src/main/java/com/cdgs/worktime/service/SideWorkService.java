package com.cdgs.worktime.service;

import java.util.List;

import com.cdgs.worktime.dto.EmployeeDto;
import com.cdgs.worktime.dto.EmployeeHasSideworkHistoryDto;
import com.cdgs.worktime.dto.SideworkHistoryDto;

public interface SideWorkService {

	List<SideworkHistoryDto> getSideWorkById(Long id);

	EmployeeDto postEmployeeName(EmployeeDto employeeName);
	
	SideworkHistoryDto postSideWorkTime(SideworkHistoryDto sideTime);
}
