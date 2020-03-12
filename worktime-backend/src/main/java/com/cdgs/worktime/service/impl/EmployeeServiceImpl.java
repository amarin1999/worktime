package com.cdgs.worktime.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cdgs.worktime.dto.EmployeeDto;
import com.cdgs.worktime.entity.EmployeeEntity;
import com.cdgs.worktime.repository.EmployeeRespository;
import com.cdgs.worktime.service.EmployeeService;

@Service
public class EmployeeServiceImpl implements EmployeeService {

	private static final Logger log = LoggerFactory.getLogger(EmployeeServiceImpl.class);

	EmployeeRespository employeeRespository;
	
	@Autowired
	public EmployeeServiceImpl(EmployeeRespository employeeRespository) {
		super();
		this.employeeRespository = employeeRespository;
	}

	@Override
	public List<EmployeeDto> getEmployeeByNo(String no) {
		List<EmployeeEntity> entity = new ArrayList<EmployeeEntity>();
		try {
			entity = employeeRespository.findByNo(no);
		} catch (Exception e) {
			e.printStackTrace();
			log.error("getEmployeeByNo >>> " + e.getMessage());
		}
		return mapListEntityToDto(entity);

	}
	
	private List<EmployeeDto> mapListEntityToDto( List<EmployeeEntity> entities) {
		List<EmployeeDto> dtoList = new ArrayList<EmployeeDto>();
		if (entities != null) {
			for (EmployeeEntity entity : entities) {
				dtoList.add(mapEntityToDto(entity));
			}
		}
		return dtoList;
		
	}

	private EmployeeDto mapEntityToDto(EmployeeEntity entity) {
		EmployeeDto dto = new EmployeeDto();
		if (entity != null) {
			dto.setId(entity.getEmployeeId());
			dto.setNo(entity.getEmployeeno());
			dto.setFirstname(entity.getFirstname());
			dto.setLastname(entity.getLastname());
//			if (entity.getCoursesEntity() != null) {
//				dto.setCourseId(entity.getCoursesEntity().getCourseId());
//			}
		}
		return dto;
		
	}

//	@Override
//	public EmployeeDto updateEmployeeName(Long id,EmployeeDto body) {
//		EmployeeEntity employeeData = convDtotoEntity(body);
//		EmployeeEntity entity = new EmployeeEntity();
//		Optional<EmployeeEntity> employeeEntity = employeeRespository.findById(String.valueOf(id));
//		if (!employeeEntity.isPresent()) {
//			return mapEntityToDto(employeeEntity.get());
//		}
//		employeeData.setEmployeeId(id);
//		entity = employeeRespository.save(employeeData);
//		return mapEntityToDto(entity);
//	}

	private EmployeeEntity convDtotoEntity(EmployeeDto body) {
		EmployeeEntity entity = new EmployeeEntity();
		entity.setFirstname(body.getFirstname());
		entity.setLastname(body.getLastname());
		return entity;
	}

	@Override
	public EmployeeDto updateEmployeeName(Long id, EmployeeDto body) {
		// TODO Auto-generated method stub
		return null;
	}

}
