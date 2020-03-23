package com.cdgs.worktime.service;

import java.util.List;

import com.cdgs.worktime.dto.EmployeeDto;
import com.cdgs.worktime.dto.EmployeeHasSideworkHistoryDto;

public interface EmployeeHasSideworkHistoryService  {
	EmployeeHasSideworkHistoryDto postEmployeeHasHistory(Long employee,Long i);

}
