package com.cdgs.worktime.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cdgs.worktime.dto.EmployeeDto;
import com.cdgs.worktime.dto.EmployeeHasSideworkHistoryDto;
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
	@Autowired(required = true)
	SideWorkRepository sideworkrepository;
	EmployeeRespository employeerespository;

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
			dto.setWorkComment(entity.getWorkComment());
		}
		return dto;

	}

	@Override
	public EmployeeDto postEmployeeName(EmployeeDto employeeName) {
		EmployeeEntity employeeNameData = convDtoToEntity(employeeName);
		EmployeeEntity entity = new EmployeeEntity();
		try {
			if (employeeName != null) {
				entity = employeerespository.save(employeeNameData);
			}
		} catch (Exception e) {
			log.error("getName Error=>" + e.getMessage());
		}
		return convEntityToDto(entity);
	}
	
	
	private EmployeeDto convEntityToDto(EmployeeEntity entity) {
		EmployeeDto dto = new EmployeeDto();
		if (entity != null) {
			dto.setFirstname(entity.getFirstname());
			dto.setLastname(entity.getLastname());
		}
		return dto;
	}

	private EmployeeEntity convDtoToEntity(EmployeeDto employeeName) {
		EmployeeEntity entity = new EmployeeEntity();
		entity.setFirstname(employeeName.getFirstname());
		entity.setLastname(employeeName.getLastname());
		return entity;
	}

	
	@Override
	public SideworkHistoryDto postSideWorkTime(SideworkHistoryDto sideTime) {
		SideworkHistoryEntity sideTimeData = convDtoToEntityTime(sideTime);
		SideworkHistoryEntity entity = new SideworkHistoryEntity();
		try {
			if (sideTime != null) {
				entity = sideworkrepository.save(sideTimeData);
			}
		} catch (Exception e) {
			log.error("getTime Error=>" + e.getMessage());
		}
		return convEntityToDtoTime(entity);
	}

	private SideworkHistoryDto convEntityToDtoTime(SideworkHistoryEntity entity) {
		SideworkHistoryDto dto = new SideworkHistoryDto();
		if (entity != null) {
			dto.setStartTime(entity.getStartTime());
			dto.setEndTime(entity.getEndTime());
		}
		return dto;
	}

	private SideworkHistoryEntity convDtoToEntityTime(SideworkHistoryDto entity) {
		SideworkHistoryEntity dto = new SideworkHistoryEntity();
		if (entity != null) {
			dto.setStartTime(entity.getStartTime());
			dto.setEndTime(entity.getEndTime());
		}
		return dto;
	}

}
