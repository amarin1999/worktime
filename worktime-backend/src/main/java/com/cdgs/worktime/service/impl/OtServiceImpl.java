package com.cdgs.worktime.service.impl;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;
import java.util.TimeZone;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cdgs.worktime.dto.EmployeeHasSideworkHistoryDto;
import com.cdgs.worktime.dto.OtHistoryDto;
import com.cdgs.worktime.dto.OtNoListDto;
import com.cdgs.worktime.dto.OtPostTimeDto;
import com.cdgs.worktime.dto.OtPutTimeDto;
import com.cdgs.worktime.dto.SideworkDateToSting;
import com.cdgs.worktime.dto.SideworkHistoryDto;
import com.cdgs.worktime.dto.TimeListDto;
import com.cdgs.worktime.entity.OtHistoryEntity;
import com.cdgs.worktime.entity.SideworkHistoryEntity;
import com.cdgs.worktime.repository.OtRespository;
import com.cdgs.worktime.service.OtService;

@Service
public class OtServiceImpl implements OtService {

	private static final Logger log = LoggerFactory.getLogger(EmployeeServiceImpl.class);

	@Autowired
	OtRespository otRespository;

	@Override
	public OtHistoryDto postOtTime(OtPostTimeDto otPostTime, EmployeeHasSideworkHistoryDto employeeHasSidework) {
		OtHistoryEntity entity = new OtHistoryEntity();
		DateFormat dateformat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		List<OtHistoryEntity> entities = new ArrayList<>();
		for (TimeListDto time : otPostTime.getTimeRange()) {
			entity.setEmployeeHasSideworkId(employeeHasSidework.getEmployeehasId());
			entity.setEndTime(time.getEndTime());
			entity.setLastUpDate(Calendar.getInstance().getTime());
			entity.setProjectId(otPostTime.getProjectNo());
			entity.setRemark(otPostTime.getRemark());
			entity.setStartTime(time.getStartTime());
			entity.setOtHistoryId((long) 0);
			entities.add(entity);
		}
		otRespository.saveAll(entities);
		return null;

	}

	@Override
	public OtNoListDto getOtTime(Long id) {
		Optional<OtHistoryEntity> entity = otRespository.findById(id);
		return mapOtEntityToDtoNolist(entity.get());

	}

	private List<OtNoListDto> mapOtListEntityToDto(List<OtHistoryEntity> entities) {
		List<OtNoListDto> listDto = new ArrayList<>();
		if (!entities.isEmpty()) {
			for (OtHistoryEntity entitiy : entities) {
				listDto.add(mapOtEntityToDtoNolist(entitiy));
			}
		}
		return listDto;

	}

	private OtNoListDto mapOtEntityToDtoNolist(OtHistoryEntity entity) {
		OtNoListDto dto = new OtNoListDto();
		DateFormat dateTimeFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm");
		dateTimeFormat.setTimeZone(TimeZone.getTimeZone("GMT+7"));

		if (entity != null) {
			dto.setEmployeehasId(entity.getEmployeeHasSideworkId());
			dto.setEndTime(dateTimeFormat.format(entity.getEndTime()));
			dto.setId(entity.getOtHistoryId());
			dto.setIdProject(entity.getProjectId());
			dto.setRemark(entity.getRemark());
			dto.setStartTime(dateTimeFormat.format(entity.getStartTime()));
		}

		return dto;

	}

	@Override
	public OtHistoryDto putOtTime(OtPutTimeDto body) {
		OtHistoryEntity entity = otRespository.getOtById(body.getId());

		System.out.println(entity);
		entity.setEndTime(body.getEndTime());
		entity.setLastUpDate(Calendar.getInstance().getTime());
		entity.setOtHistoryId(body.getId());
		entity.setProjectId(body.getProjectNo());
		entity.setRemark(body.getRemark());
		entity.setStartTime(body.getStartTime());
		otRespository.save(entity);
		return null;
	}
	
	@Override
	public OtNoListDto getOtbyNo(Long no) {
		OtHistoryEntity entity = new OtHistoryEntity();
		try {
			entity = otRespository.getOtById(no);
		} catch (Exception e) {
			e.printStackTrace();
			log.error("getOtByNo >>> " + e.getMessage());
		}
		return mapListEntityToDto(entity);
	}
	
	private OtNoListDto mapListEntityToDto(OtHistoryEntity entities) {
		OtNoListDto dtoList = new OtNoListDto();
		if (entities != null) {
				dtoList = mapEntityToDto(entities);
		}
		return dtoList;
	}
	
	private OtNoListDto mapEntityToDto(OtHistoryEntity entity) {
		OtNoListDto dto = new OtNoListDto();
		DateFormat dateTimeFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm");
		dateTimeFormat.setTimeZone(TimeZone.getTimeZone("GMT+7"));
		
		if(entity != null) {
			dto.setId(entity.getOtHistoryId());
			dto.setEmployeehasId(entity.getEmployeeHasSideworkId());
			dto.setStartTime(dateTimeFormat.format(entity.getStartTime()));
			dto.setEndTime(dateTimeFormat.format(entity.getEndTime()));
			dto.setRemark(entity.getRemark());
			dto.setLastUpdate(entity.getLastUpDate());
			dto.setIdProject(entity.getProjectId());
		}
		return dto;
	}
	
	@Override
	public boolean deleteOtTime(Long OtId) {
		try {
			otRespository.deleteOtById(OtId);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			log.error("getOt >>> " + e.getMessage());
			return false;
		}
	}
	
	
	
}
