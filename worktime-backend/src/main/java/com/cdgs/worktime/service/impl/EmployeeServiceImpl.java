package com.cdgs.worktime.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.tempuri.ISWebService.ISService.ISServiceSoapProxy;

import com.cdgs.worktime.dto.CheckAuthenDto;
import com.cdgs.worktime.dto.EmployeeByDayDto;
import com.cdgs.worktime.dto.EmployeeDayDto;
import com.cdgs.worktime.dto.EmployeeDto;
import com.cdgs.worktime.entity.EmployeeEntity;
import com.cdgs.worktime.repository.EmployeeHasSideworkHistoryRespository;
import com.cdgs.worktime.repository.EmployeeRespository;
import com.cdgs.worktime.service.EmployeeService;

@Service
public class EmployeeServiceImpl implements EmployeeService {

	private static final Logger log = LoggerFactory.getLogger(EmployeeServiceImpl.class);

	EmployeeRespository employeeRespository;
	@Autowired
	EmployeeHasSideworkHistoryRespository employeeHasSideworkHistoryRespository;
	
	@Autowired
	public EmployeeServiceImpl(EmployeeRespository employeeRespository) {
		super();
		this.employeeRespository = employeeRespository;
	}
	
	@Override
	public boolean checkAuthenEmployee(CheckAuthenDto body) {
		boolean res = false;
		try { 
			ISServiceSoapProxy ispo = new ISServiceSoapProxy();
			res = ispo.checkUserAuthentication(body.getUserID(), body.getPassword());
			return res;
		} catch (Exception e) {
			e.printStackTrace();
			log.error("checkAuthen >>> " + e.getMessage());
			return res;
		}
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
	@Override
	public List<EmployeeByDayDto> getEmployeeByDay(String year, String month, String day, Long work) {
		List<EmployeeByDayDto> entity = new ArrayList<EmployeeByDayDto>();
		try {
			entity = employeeHasSideworkHistoryRespository.findByDay(year, month, day, work);
		} catch (Exception e) {
			e.printStackTrace();
			log.error("getEmployeeByDay >>> " + e.getMessage());
		}
		return entity;
	}
	
	@Override
	public List<EmployeeByDayDto> getEmployeeAllByDay(String year, String month, String day) {
		List<EmployeeByDayDto> entity = new ArrayList<EmployeeByDayDto>();
		try {
			entity = employeeHasSideworkHistoryRespository.findEmpAllByDay(year, month, day);
		} catch (Exception e) {
			e.printStackTrace();
			log.error("getEmployeeByDay >>> " + e.getMessage());
		}
		return entity;
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
			dto.setAccessReport(entity.getAccessReport());
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

	@Override
	public List<EmployeeDto> getEmployeeAll() {
		List<EmployeeEntity> entity = new ArrayList<EmployeeEntity>();
		try {
			entity = employeeRespository.selectEmployeeNo();
		} catch (Exception e) {
			e.printStackTrace();
			log.error("getEmployeeByNo >>> " + e.getMessage());
		}
		return mapListEntityToDto(entity);
		
	}
	@Override
	public EmployeeDto putEmployeeAccess(EmployeeDto body) {
		EmployeeEntity employeeData = convDtotoEntity(body);
		EmployeeEntity entityDto = employeeRespository.findById(body.getId()).orElse(null);
		entityDto.setAccessReport(body.getAccessReport());
		employeeData = employeeRespository.save(entityDto);
		return mapEntityToDto(employeeData);
	}
	
	@Override
	public List<EmployeeDto> getEmployeeByAccessReport(String accessReport) {
		List<EmployeeEntity> entity = new ArrayList<EmployeeEntity>();
		try {
			if (accessReport.equals("N")) {
				entity = employeeRespository.findByAllAccessReport(accessReport);
			} else {				
				entity = employeeRespository.findByAccessReport(accessReport);
			}
		} catch (Exception e) {
			e.printStackTrace();
			log.error("getEmployeeByAccessReport >>> " + e.getMessage());
		}
		return mapListEntityToDto(entity);
	}
	
	@Override
	public EmployeeEntity postEmployee(EmployeeEntity body) {
//		return employeeRespository.save(body);
		 EmployeeEntity entity = new EmployeeEntity();
		  try {
		   entity = employeeRespository.save(body);
		  } catch (Exception e) {
		   log.error("postEmployee >>>" + e.getMessage());
		  }
		  return entity;
	}
	

}
