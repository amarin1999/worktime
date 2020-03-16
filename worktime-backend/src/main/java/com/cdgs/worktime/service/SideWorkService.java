package com.cdgs.worktime.service;

import java.util.Date;
import java.util.List;

import com.cdgs.worktime.dto.EmployeeDto;
import com.cdgs.worktime.dto.EmployeeHasSideworkHistoryDto;
import com.cdgs.worktime.dto.SideWorkPostTimeDto;
import com.cdgs.worktime.dto.SideworkHistoryDto;

public interface SideWorkService {

	List<SideworkHistoryDto> getSideWorkById(Long id);
	

	SideworkHistoryDto postSideWorkTime(SideWorkPostTimeDto sideTime,Long employee, String date,EmployeeHasSideworkHistoryDto employeeHasSide );
	
	SideworkHistoryDto getSideWorkTime(String string,Long employeeId);
}
