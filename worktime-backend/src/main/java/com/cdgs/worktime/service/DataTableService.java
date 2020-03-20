package com.cdgs.worktime.service;

import java.util.List;

import com.cdgs.worktime.dto.OtNoListDto;
import com.cdgs.worktime.dto.SideworkHistoryDto;

public interface DataTableService {
	
	List<SideworkHistoryDto> getSideWorkAll(Long employeeId);
	
	List<OtNoListDto> getOtAll(Long employeeId);

}