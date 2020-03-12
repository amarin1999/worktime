package com.cdgs.worktime.service.impl;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.cdgs.worktime.dto.EmployeeDto;
import com.cdgs.worktime.dto.EmployeeHasSideworkHistoryDto;
import com.cdgs.worktime.entity.EmployeeEntity;
import com.cdgs.worktime.entity.EmployeeHasSideworkHistoryEntity;
import com.cdgs.worktime.repository.EmployeeHasSideworkHistoryRespository;
import com.cdgs.worktime.service.EmployeeHasSideworkHistoryService;

public class EmployeeHasSideworkHistoryServiceImpl implements EmployeeHasSideworkHistoryService {

	private static final Logger log = LoggerFactory.getLogger(EmployeeServiceImpl.class);
	@Autowired
	EmployeeHasSideworkHistoryRespository employeeHasSideworkHistoryRespository;
	
	@Override
	public EmployeeHasSideworkHistoryDto getEmployeeHasHistory(Long id) {
		EmployeeHasSideworkHistoryEntity entity= new EmployeeHasSideworkHistoryEntity();
		EmployeeHasSideworkHistoryEntity data= new EmployeeHasSideworkHistoryEntity();
		EmployeeEntity setId =new EmployeeEntity();
		setId.setEmployeeId(id);
		data= setToEmployeeId(setId);
		entity=employeeHasSideworkHistoryRespository.save(data);
		return mapEntityToDto(entity);
		

		
	}
	private EmployeeHasSideworkHistoryDto mapEntityToDto(EmployeeHasSideworkHistoryEntity entity) {
		EmployeeHasSideworkHistoryDto dto = new EmployeeHasSideworkHistoryDto();
		if (entity != null) {
			dto.setEmployeehasId(entity.getEmployeeHasSideworkHistoryId());
			dto.setWorkType(entity.getWorkType());
		}
		return dto;
		
	}
	
	private EmployeeHasSideworkHistoryEntity setToEmployeeId(EmployeeEntity id) {
		EmployeeHasSideworkHistoryEntity entity = new EmployeeHasSideworkHistoryEntity();
		entity.setEmployeeId(id);
		return entity;
	}

}
