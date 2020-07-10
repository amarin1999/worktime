package com.cdgs.worktime.service;

import java.util.List;

import javax.validation.Valid;

import com.cdgs.worktime.dto.EmployeeHasSideworkHistoryDto;
import com.cdgs.worktime.dto.OtHistoryDto;
import com.cdgs.worktime.dto.OtNoListDto;
import com.cdgs.worktime.dto.OtPostTimeDto;
import com.cdgs.worktime.dto.OtPutTimeDto;

public interface OtService {
	
	OtHistoryDto postOtTime(OtPostTimeDto otPostTime,EmployeeHasSideworkHistoryDto employeeHasSidework );
	
	OtNoListDto getOtTime(Long id);
	
	OtHistoryDto putOtTime(OtPutTimeDto bady);
	
	OtNoListDto getOtbyNo(Long no);
	
	boolean deleteOtTime(Long OtId);

}
