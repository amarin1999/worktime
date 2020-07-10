package com.cdgs.worktime.service;

import java.text.ParseException;
import java.util.Date;
import java.util.List;

import javax.validation.Valid;

import com.cdgs.worktime.dto.EmployeeDto;
import com.cdgs.worktime.dto.EmployeeHasSideworkHistoryDto;
import com.cdgs.worktime.dto.OtHistoryDto;
import com.cdgs.worktime.dto.OtPutTimeDto;
import com.cdgs.worktime.dto.SideWorkPostTimeDto;
import com.cdgs.worktime.dto.SideWorkPutTimeDto;
import com.cdgs.worktime.dto.SideworkHistoryDto;

public interface SideWorkService {


	SideworkHistoryDto postSideWorkTime(SideWorkPostTimeDto sideTime,EmployeeDto employee, String date) throws ParseException;
	
	SideworkHistoryDto getSideWorkTime(String string,Long employeeId);
	
	SideworkHistoryDto putSideWorkTime(SideWorkPutTimeDto body) throws ParseException;
	
	SideworkHistoryDto getSideworkByNo(Long no);
	
	boolean deleteSideWorktime(Long sideworkId);

}
