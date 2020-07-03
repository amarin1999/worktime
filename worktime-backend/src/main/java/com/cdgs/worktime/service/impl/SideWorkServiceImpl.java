package com.cdgs.worktime.service.impl;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.ls.LSInput;

import com.cdgs.worktime.dto.EmployeeDto;
import com.cdgs.worktime.dto.EmployeeHasSideworkHistoryDto;
import com.cdgs.worktime.dto.SideWorkPostTimeDto;
import com.cdgs.worktime.dto.SideWorkPutTimeDto;
import com.cdgs.worktime.dto.SideworkHistoryDto;
import com.cdgs.worktime.entity.EmployeeEntity;
import com.cdgs.worktime.entity.EmployeeHasSideworkHistoryEntity;
import com.cdgs.worktime.entity.SideworkHistoryEntity;
import com.cdgs.worktime.repository.EmployeeRespository;
import com.cdgs.worktime.repository.SideWorkRepository;
import com.cdgs.worktime.service.EmployeeHasSideworkHistoryService;
import com.cdgs.worktime.service.SideWorkService;

@Service
public class SideWorkServiceImpl implements SideWorkService {

	private static final Logger log = LoggerFactory.getLogger(EmployeeServiceImpl.class);

	SideWorkRepository sideworkrepository;
	EmployeeRespository employeerespository;
	EmployeeHasSideworkHistoryService employeeHasSideworkHistoryService;

	@Autowired
	public SideWorkServiceImpl(SideWorkRepository sideworkrepository, EmployeeRespository employeerespository,
			EmployeeHasSideworkHistoryService employeeHasSideworkHistoryService) {
		super();
		this.sideworkrepository = sideworkrepository;
		this.employeerespository = employeerespository;
		this.employeeHasSideworkHistoryService = employeeHasSideworkHistoryService;
	}

	@Override
	public SideworkHistoryDto postSideWorkTime(SideWorkPostTimeDto sideTime, EmployeeDto employee, String date) throws ParseException  {

		SideworkHistoryEntity entity = sideworkrepository.findDateTimeByString(date, employee.getId());
		SideworkHistoryEntity data = new SideworkHistoryEntity();
		 SimpleDateFormat formatTime=new SimpleDateFormat("HH:mm"); 
		if (entity != null) {
			entity.setEndTime(formatTime.parse(sideTime.getEndTime()));
			entity.setLastUpdate(Calendar.getInstance().getTime());
			entity.setStartTime(formatTime.parse(sideTime.getStartTime()));
			entity.setWorkAnyWhere(sideTime.getWorkAnyWhere());
			entity.setRemark(sideTime.getRemark());
			entity.setDate(sideTime.getDate());
			return convEntityToDto(sideworkrepository.save(entity));
		} else {
			EmployeeHasSideworkHistoryDto employeeHasSideWorkHistory = employeeHasSideworkHistoryService
					.postEmployeeHasHistory(employee.getId(), (long) 1);
			data.setIdEmployeeHasSideWorkHistory(employeeHasSideWorkHistory.getEmployeehasId());
			data.setEndTime(formatTime.parse(sideTime.getEndTime()));
			data.setLastUpdate(Calendar.getInstance().getTime());
			data.setStartTime(formatTime.parse(sideTime.getStartTime()));
			data.setWorkAnyWhere(sideTime.getWorkAnyWhere());
			data.setRemark(sideTime.getRemark());
			data.setDate(sideTime.getDate());
			return convEntityToDto(sideworkrepository.save(data));
		}
	}

	private SideworkHistoryEntity convPostDtoToEntity(SideWorkPostTimeDto dto) throws ParseException  {
		SideworkHistoryEntity entity = new SideworkHistoryEntity();
		DateFormat timeFormat = new SimpleDateFormat("HH:mm");
		if (dto != null) {
			entity.setEndTime(timeFormat.parse(dto.getEndTime()));
			entity.setLastUpdate(Calendar.getInstance().getTime());
			entity.setStartTime(timeFormat.parse(dto.getStartTime()));
			entity.setRemark(dto.getRemark());
			entity.setWorkAnyWhere(dto.getWorkAnyWhere());
		}
		return entity;
	}

	private SideworkHistoryDto convEntityToDto(SideworkHistoryEntity entity) {
		SideworkHistoryDto dto = new SideworkHistoryDto();
		if (entity != null) {
			
			dto.setStartTime(entity.getStartTime());
			dto.setRemark(entity.getRemark());
			dto.setWorkAnyWhere(entity.getWorkAnyWhere());
			dto.setEmployeehasId(entity.getIdEmployeeHasSideWorkHistory());
			dto.setId(entity.getSideworkId());
		}
		return dto;
	}

	@Override
	public SideworkHistoryDto getSideWorkTime(String sideWorkDate, Long employeeId) {
		SideworkHistoryEntity entity = sideworkrepository.findDateTimeByString(sideWorkDate, employeeId);
		return convEntityToDto(entity);
	}

	@Override
	public SideworkHistoryDto putSideWorkTime(SideWorkPutTimeDto body) throws ParseException {
		
		SideworkHistoryEntity entity = sideworkrepository.getSideWorkIdById(body.getId());
		SideworkHistoryEntity data = new SideworkHistoryEntity();
		SimpleDateFormat formatTime = new SimpleDateFormat("HH:mm"); 
		
		System.out.println(entity);
		entity.setEndTime(formatTime.parse(body.getEndTime()));
		entity.setLastUpdate(Calendar.getInstance().getTime());
		entity.setStartTime(formatTime.parse(body.getStartTime()));
		entity.setWorkAnyWhere(body.getWorkAnyWhere());
		entity.setRemark(body.getRemark());
		sideworkrepository.save(entity);
		
		return null;
	}
	
	@Override
	public SideworkHistoryDto getSideworkByNo(Long no) {
		SideworkHistoryEntity entity = new SideworkHistoryEntity();
		try {
			entity = sideworkrepository.getSideWorkIdById(no);
		} catch (Exception e) {
			e.printStackTrace();
			log.error("getEmployeeByNo >>> " + e.getMessage());
		}
		return mapListEntityToDto(entity);

	}
	
	private SideworkHistoryDto mapListEntityToDto(SideworkHistoryEntity entities) {
		SideworkHistoryDto dtoList = new SideworkHistoryDto();
		if (entities != null) {
				dtoList = mapEntityToDto(entities);
		}
		return dtoList;
		
	}

	private SideworkHistoryDto mapEntityToDto(SideworkHistoryEntity entity) {
		SideworkHistoryDto dto = new SideworkHistoryDto();
		SimpleDateFormat formatTime = new SimpleDateFormat("HH:mm"); 
		if (entity != null) {
			dto.setId(entity.getSideworkId());
			dto.setEmployeehasId(entity.getIdEmployeeHasSideWorkHistory());
			dto.setStartTime(entity.getStartTime());
			dto.setEndTime(entity.getEndTime());
			dto.setLastUpdate(entity.getLastUpdate());
			dto.setRemark(entity.getRemark());
			dto.setWorkAnyWhere(entity.getWorkAnyWhere());
		}
		return dto;
	}

	@Override
	public boolean deleteSideWorktime(Long sideworkId) {
		try {
			sideworkrepository.deleteSideWorkById(sideworkId);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			log.error("getSidework >>> " + e.getMessage());
			return false;
		}
		
	}
	
}
