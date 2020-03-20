package com.cdgs.worktime.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cdgs.worktime.dto.OtNoListDto;
import com.cdgs.worktime.dto.SideworkHistoryDto;
import com.cdgs.worktime.entity.OtHistoryEntity;
import com.cdgs.worktime.entity.SideworkHistoryEntity;
import com.cdgs.worktime.repository.DataTableRespository;
import com.cdgs.worktime.repository.OtRespositiry;
import com.cdgs.worktime.repository.SideWorkRepository;
import com.cdgs.worktime.service.DataTableService;
import com.cdgs.worktime.service.SideWorkService;

@Service
public class DataTableServiceImpl implements DataTableService {

	
	SideWorkRepository sideWorkRepository;
	OtRespositiry otRespositiry;

	public DataTableServiceImpl(SideWorkRepository sideWorkRepository, OtRespositiry otRespositiry) {
		super();
		this.sideWorkRepository = sideWorkRepository;
		this.otRespositiry = otRespositiry;
	}

	private static final Logger log = LoggerFactory.getLogger(EmployeeServiceImpl.class);

	@Override
	public List<SideworkHistoryDto> getSideWorkAll(Long employeeId) {	
		List<SideworkHistoryEntity> entity =new ArrayList<SideworkHistoryEntity>();
		try {
			entity = sideWorkRepository.getSideworkAll(employeeId);	
		}catch (Exception e) { 
			log.error("getEmployeeByNo >>> " + e.getMessage());
		}
		return mapSideworkListEntityToDto(entity);
	}

	private List<SideworkHistoryDto> mapSideworkListEntityToDto(List<SideworkHistoryEntity> entities) {
		List<SideworkHistoryDto> listDto = new ArrayList<>();
		if (!entities.isEmpty()) {
			for (SideworkHistoryEntity entitiy : entities) {
				listDto.add(mapSideworkEntityToDto(entitiy));
			}
		}
		return listDto;

	}

	private SideworkHistoryDto mapSideworkEntityToDto(SideworkHistoryEntity entity) {
		SideworkHistoryDto dto =new SideworkHistoryDto();
		if(entity != null) {
			dto.setEmployeehasId(entity.getIdEmployeeHasSideWorkHistory());
			dto.setEndTime(entity.getEndTime());
			dto.setId(entity.getSideworkId());
			dto.setLastUpdate(entity.getLastUpdate());
			dto.setRemark(entity.getRemark());
			dto.setStartTime(entity.getStartTime());
			dto.setWorkAnyWhere(entity.getWorkAnyWhere());
		}
		return dto;
		
	}

	@Override
	public List<OtNoListDto> getOtAll(Long employeeId) {
		List<OtHistoryEntity> entity =new ArrayList<OtHistoryEntity>();
		
		try {
			entity = otRespositiry.getOtAll(employeeId);
		}catch (Exception e) { 
			log.error("getOtAll >>> " + e.getMessage());
		}
		return mapOtListEntityToDto(entity);
	}
	
	private List<OtNoListDto> mapOtListEntityToDto(List<OtHistoryEntity> entities) {
		List<OtNoListDto> listDto = new ArrayList<>();
		if (!entities.isEmpty()) {
			for (OtHistoryEntity entitiy : entities) {
				listDto.add(mapOtEntityToDto(entitiy));
			}
		}
		return listDto;

	}

	private OtNoListDto mapOtEntityToDto(OtHistoryEntity entity) {
		OtNoListDto dto =new OtNoListDto();
		if(entity != null) {
			dto.setEmployeehasId(entity.getEmployeeHasSideworkId());
			dto.setEndTime(entity.getEndTime());
			dto.setId(entity.getOtHistoryId());
			dto.setLastUpdate(entity.getLastUpDate());
			dto.setRemark(entity.getRemark());
			dto.setStartTime(entity.getStartTime());
			dto.setIdProject(entity.getProjectId());
		}
		return dto;
		
	}

}
