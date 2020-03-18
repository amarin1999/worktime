package com.cdgs.worktime.service.impl;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cdgs.worktime.dto.EmployeeHasSideworkHistoryDto;
import com.cdgs.worktime.dto.OtHistoryDto;
import com.cdgs.worktime.dto.OtPostTimeDto;
import com.cdgs.worktime.dto.TimeListDto;
import com.cdgs.worktime.entity.OtHistoryEntity;
import com.cdgs.worktime.repository.OtRespositiry;
import com.cdgs.worktime.service.OtService;

@Service
public class OtServiceImpl implements OtService {

	@Autowired
	OtRespositiry otRespositiry;
	
	@Override
	public OtHistoryDto postOtTime(OtPostTimeDto otPostTime, EmployeeHasSideworkHistoryDto employeeHasSidework) {
		OtHistoryEntity entity = new OtHistoryEntity();
		DateFormat dateformat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

		for (TimeListDto time : otPostTime.getTimeRange()) {
			entity.setEmployeeHasSideworkId(employeeHasSidework.getEmployeehasId());
			entity.setEndTime(time.getEndTime());
			entity.setLastUpDate(Calendar.getInstance().getTime());
			entity.setProjectId(otPostTime.getProjectNo());
			entity.setRemark(otPostTime.getRemark());
			entity.setStartTime(time.getStartTime());
			otRespositiry.save(entity);
		}

		return null;

	}

}
