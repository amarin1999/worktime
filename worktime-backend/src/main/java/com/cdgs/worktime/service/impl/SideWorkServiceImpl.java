package com.cdgs.worktime.service.impl;

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
import com.cdgs.worktime.dto.SideworkHistoryDto;
import com.cdgs.worktime.entity.EmployeeEntity;
import com.cdgs.worktime.entity.EmployeeHasSideworkHistoryEntity;
import com.cdgs.worktime.entity.SideworkHistoryEntity;
import com.cdgs.worktime.repository.EmployeeRespository;
import com.cdgs.worktime.repository.SideWorkRepository;
import com.cdgs.worktime.service.SideWorkService;

@Service
public class SideWorkServiceImpl implements SideWorkService {

	private static final Logger log = LoggerFactory.getLogger(EmployeeServiceImpl.class);

	SideWorkRepository sideworkrepository;
	EmployeeRespository employeerespository;

	@Autowired(required = true)
	public SideWorkServiceImpl(SideWorkRepository sideworkrepository, EmployeeRespository employeerespository) {
		super();
		this.sideworkrepository = sideworkrepository;
		this.employeerespository = employeerespository;
	}

	@Override
	public List<SideworkHistoryDto> getSideWorkById(Long id) {
		List<SideworkHistoryEntity> entity = new ArrayList<>();
		try {
			entity = sideworkrepository.getSideWorkById(id);
		} catch (Exception e) {
			e.printStackTrace();
			log.error("message", e);

		}
		return mapListEntityToDto(entity);

	}

	private List<SideworkHistoryDto> mapListEntityToDto(List<SideworkHistoryEntity> entities) {
		List<SideworkHistoryDto> dtoList = new ArrayList<>();
		if (entities != null) {
			for (SideworkHistoryEntity entity : entities) {
				dtoList.add(mapEntityToDto(entity));
			}
		}
		return dtoList;

	}

	private SideworkHistoryDto mapEntityToDto(SideworkHistoryEntity entity) {
		SideworkHistoryDto dto = new SideworkHistoryDto();
		if (entity != null) {
			dto.setStartTime(entity.getStartTime());
			dto.setEndTime(entity.getEndTime());
			dto.setRemark(entity.getRemark());
		}
		return dto;

	}


	@Override
	public SideworkHistoryDto postSideWorkTime(SideWorkPostTimeDto sideTime,
			Long employeeId,String date,EmployeeHasSideworkHistoryDto employeeHasSide) {		

		SideworkHistoryEntity entity = sideworkrepository.findDateTimeByString(date, employeeId);
		System.out.println(entity);
		SideworkHistoryEntity data = new SideworkHistoryEntity();		
		if (entity != null) {
			entity.setEndTime(sideTime.getEndTime());
			entity.setLastUpdate(Calendar.getInstance().getTime());
			entity.setStartTime(sideTime.getStartTime());
			entity.setWorkAnyWhere(sideTime.getWorkAnyWhere());
			entity.setRemark(sideTime.getRemark());
			entity.setIdEmployeeHasSideWorkHistory(employeeHasSide.getEmployeehasId());
			return convEntityToDto(sideworkrepository.save(entity));
		} else {
			data.setIdEmployeeHasSideWorkHistory(employeeHasSide.getEmployeehasId());
			data.setEndTime(sideTime.getEndTime());
			data.setLastUpdate(Calendar.getInstance().getTime());
			data.setStartTime(sideTime.getStartTime());
			data.setWorkAnyWhere(sideTime.getWorkAnyWhere());
			data.setRemark(sideTime.getRemark());
			return convEntityToDto(sideworkrepository.save(data));
		}
	}

	private SideworkHistoryEntity convPostDtoToEntity(SideWorkPostTimeDto dto) {
		SideworkHistoryEntity entity = new SideworkHistoryEntity();
		if (dto != null) {
			entity.setEndTime(dto.getEndTime());
			entity.setLastUpdate(Calendar.getInstance().getTime());
			entity.setStartTime(dto.getStartTime());
			entity.setRemark(dto.getRemark());
			entity.setWorkAnyWhere(dto.getWorkAnyWhere());
		}
		return entity;
	}

	private SideworkHistoryDto convEntityToDto(SideworkHistoryEntity entity) {
		SideworkHistoryDto dto = new SideworkHistoryDto();
		if (entity !=null) {
			dto.setEndTime(entity.getEndTime());
			dto.setLastUpdate(Calendar.getInstance().getTime());
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
		System.out.println(sideWorkDate);
		SideworkHistoryEntity entity = sideworkrepository.findDateTimeByString(sideWorkDate, employeeId);		
		return convEntityToDto(entity);
	}



}
