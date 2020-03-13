package com.cdgs.worktime.service.impl;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cdgs.worktime.dto.EmployeeDto;
import com.cdgs.worktime.dto.EmployeeHasSideworkHistoryDto;
import com.cdgs.worktime.entity.EmployeeEntity;
import com.cdgs.worktime.entity.EmployeeHasSideworkHistoryEntity;
import com.cdgs.worktime.repository.EmployeeHasSideworkHistoryRespository;
import com.cdgs.worktime.service.EmployeeHasSideworkHistoryService;

@Service
public class EmployeeHasSideworkHistoryServiceImpl implements EmployeeHasSideworkHistoryService {

	private static final Logger log = LoggerFactory.getLogger(EmployeeServiceImpl.class);

	EmployeeHasSideworkHistoryRespository employeeHasSideworkHistoryRespository;

	@Autowired
	public EmployeeHasSideworkHistoryServiceImpl(
			EmployeeHasSideworkHistoryRespository employeeHasSideworkHistoryRespository) {
		super();
		this.employeeHasSideworkHistoryRespository = employeeHasSideworkHistoryRespository;
	}

	@Override
	public EmployeeHasSideworkHistoryDto getEmployeeHasHistory(List<EmployeeDto> employee) {
		EmployeeHasSideworkHistoryEntity entity = new EmployeeHasSideworkHistoryEntity();
		EmployeeHasSideworkHistoryEntity data = new EmployeeHasSideworkHistoryEntity();
		EmployeeEntity setId = new EmployeeEntity();
		System.out.println(employee.get(0).getId());
		data.setIdEmployee(employee.get(0).getId());
		entity = employeeHasSideworkHistoryRespository.save(data);
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

	private EmployeeEntity mapDtoToEntity(EmployeeDto dto) {
		EmployeeEntity entity = new EmployeeEntity();
		if (dto != null) {
			entity.setEmployeeId(dto.getId());
			entity.setEmployeeno(dto.getNo());
			entity.setFirstname(dto.getLastname());
			entity.setLastname(dto.getLastname());
		}
		return null;

	}

//	private EmployeeHasSideworkHistoryEntity setToEmployeeId(EmployeeEntity employeeDto) {
//		EmployeeHasSideworkHistoryEntity entity = new EmployeeHasSideworkHistoryEntity();
//		entity.setEmployeeId(employeeDto);
//		return entity;
//	}

}