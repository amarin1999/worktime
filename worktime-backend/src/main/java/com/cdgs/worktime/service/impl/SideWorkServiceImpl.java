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

	@Override
	public SideworkHistoryDto postSideWorkTime(SideWorkPostTimeDto sideTime,
			EmployeeHasSideworkHistoryDto employeeHasSideWorkHistoryData) {

		SideworkHistoryEntity entity = new SideworkHistoryEntity();
		SideworkHistoryEntity dataPostWorkToEntity = convDtoToPostTime(sideTime);

		try {
			Optional<SideworkHistoryEntity> dateSideWork = dateSideWork = sideworkrepository
					.findDateTime(sideTime.getStartTime(), employeeHasSideWorkHistoryData.getEmployeehasId());
			if (!dateSideWork.isPresent()) {
				throw new Exception("Not Found");
			}
			dataPostWorkToEntity.setEndTime(dateSideWork.get().getEndTime());
			dataPostWorkToEntity.setStartTime(dateSideWork.get().getStartTime());
			dataPostWorkToEntity.setWorkAnyWhere(dateSideWork.get().getWorkAnyWhere());
			dataPostWorkToEntity.setWorkComment(dateSideWork.get().getWorkComment());

			entity = sideworkrepository.save(dataPostWorkToEntity);
		} catch (Exception e) {
			log.error("getName Error=>" + e.getMessage());
		}
		return convEntityToDtoPostTime(entity);

	}

	private SideworkHistoryEntity convDtoToPostTime(SideWorkPostTimeDto dto) {
		SideworkHistoryEntity entity = new SideworkHistoryEntity();
		if (dto != null) {
			entity.setEndTime(dto.getEndTime());
			entity.setLastUpdate(Calendar.getInstance().getTime());
			entity.setStartTime(dto.getStartTime());
			entity.setWorkComment(dto.getRemark());
			entity.setWorkAnyWhere(dto.getWorkAnyTime());
		}
		return entity;
	}
	private SideworkHistoryDto convEntityToDtoPostTime(SideworkHistoryEntity dto) {
		SideworkHistoryDto entity = new SideworkHistoryDto();
		if (dto != null) {
			entity.setEndTime(dto.getEndTime());
			entity.setLastUpdate(Calendar.getInstance().getTime());
			entity.setStartTime(dto.getStartTime());
			entity.setWorkComment(dto.getWorkComment());
			entity.setWorkAnyWhere(dto.getWorkAnyWhere());
		}
		return entity;
	}



}
