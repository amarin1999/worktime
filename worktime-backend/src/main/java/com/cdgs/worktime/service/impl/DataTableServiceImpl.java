package com.cdgs.worktime.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.cdgs.worktime.dto.SideworkHistoryDto;
import com.cdgs.worktime.entity.SideworkHistoryEntity;
import com.cdgs.worktime.repository.DataTableRespository;
import com.cdgs.worktime.service.DataTableService;
import com.cdgs.worktime.service.SideWorkService;

@Service
public class DataTableServiceImpl implements DataTableService {

	DataTableRespository dataTableRespository;

	private static final Logger log = LoggerFactory.getLogger(EmployeeServiceImpl.class);

	@Override
	public List<SideworkHistoryDto> getSideWorkAll(Long employeeId) {
		List<SideworkHistoryEntity> entity = dataTableRespository.getSideWorkData(employeeId);
		return null;

	}

	private List<SideworkHistoryDto> mapListEntityToDto(List<SideworkHistoryEntity> entities) {
		List<SideworkHistoryDto> listDto = new ArrayList<>();
		if (!entities.isEmpty()) {
			for (SideworkHistoryEntity entitiy : entities) {
				listDto.add(mapEntityToDto(entitiy));
			}
		}
		return listDto;

	}

	private SideworkHistoryDto mapEntityToDto(SideworkHistoryEntity entity) {
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

}
