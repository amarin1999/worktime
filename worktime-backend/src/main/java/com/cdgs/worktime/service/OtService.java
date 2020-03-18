package com.cdgs.worktime.service;

import javax.validation.Valid;

import com.cdgs.worktime.dto.EmployeeHasSideworkHistoryDto;
import com.cdgs.worktime.dto.OtHistoryDto;
import com.cdgs.worktime.dto.OtPostTimeDto;

public interface OtService {
	
	OtHistoryDto postOtTime(OtPostTimeDto otPostTime,EmployeeHasSideworkHistoryDto employeeHasSidework );



}
