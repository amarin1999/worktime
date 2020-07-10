package com.cdgs.worktime.service.impl;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.TimeZone;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.logging.java.SimpleFormatter;
import org.springframework.stereotype.Service;

import com.cdgs.worktime.dto.CalendarDto;
import com.cdgs.worktime.dto.OtNoListDto;
import com.cdgs.worktime.dto.SideworkDateToSting;
import com.cdgs.worktime.dto.SideworkHistoryDto;
import com.cdgs.worktime.entity.OtHistoryEntity;
import com.cdgs.worktime.entity.SideworkHistoryEntity;
import com.cdgs.worktime.repository.OtRespository;
import com.cdgs.worktime.repository.SideWorkRepository;
import com.cdgs.worktime.service.DataTableService;
import com.cdgs.worktime.service.SideWorkService;

@Service
public class DataTableServiceImpl implements DataTableService {

	
	SideWorkRepository sideWorkRepository;
	OtRespository otRespository;

	public DataTableServiceImpl(SideWorkRepository sideWorkRepository, OtRespository otRespository) {
		super();
		this.sideWorkRepository = sideWorkRepository;
		this.otRespository = otRespository;
	}

	private static final Logger log = LoggerFactory.getLogger(EmployeeServiceImpl.class);

	@Override
	public List<SideworkDateToSting> getSideWorkAll(Long employeeId) {	
		List<SideworkHistoryEntity> entity =new ArrayList<SideworkHistoryEntity>();
		try {
			entity = sideWorkRepository.getSideworkAll(employeeId);	
		}catch (Exception e) { 
			log.error("getEmployeeByNo >>> " + e.getMessage());
		}
		return mapSideworkListEntityToDto(entity);
	}

	private List<SideworkDateToSting> mapSideworkListEntityToDto(List<SideworkHistoryEntity> entities) {
		List<SideworkDateToSting> listDto = new ArrayList<>();
		if (!entities.isEmpty()) {
			for (SideworkHistoryEntity entitiy : entities) {
				listDto.add(mapSideworkEntityToDtoString(entitiy));
			}
		}
		return listDto;

	}

	private SideworkDateToSting mapSideworkEntityToDtoString(SideworkHistoryEntity entity) {
		SideworkDateToSting dto =new SideworkDateToSting();
		DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
		dateFormat.setTimeZone(TimeZone.getTimeZone("GMT+7"));
		DateFormat timeFormat = new SimpleDateFormat("HH:mm");
		timeFormat.setTimeZone(TimeZone.getTimeZone("GMT+7"));
		if(entity != null) {
			dto.setEmployeehasId(entity.getIdEmployeeHasSideWorkHistory());
			if(entity.getEndTime() != null) {
			dto.setEndTime(timeFormat.format(entity.getEndTime()));
			}
			dto.setId(entity.getSideworkId());
			dto.setRemark(entity.getRemark());
			dto.setStartTime(timeFormat.format(entity.getStartTime()));
			dto.setWorkAnyWhere(entity.getWorkAnyWhere());
			dto.setDate(dateFormat.format(entity.getDate()));
		}
		return dto;
		
	}

	@Override
	public List<OtNoListDto> getOtAll(Long employeeId) {
		List<OtHistoryEntity> entity =new ArrayList<OtHistoryEntity>();
	
		try {
			entity = otRespository.getOtAll(employeeId);
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
		DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm");
		dateFormat.setTimeZone(TimeZone.getTimeZone("GMT+7"));
		if(entity != null) {
			dto.setEmployeehasId(entity.getEmployeeHasSideworkId());
			dto.setId(entity.getOtHistoryId());
			dto.setRemark(entity.getRemark());
			dto.setStartTime(dateFormat.format(entity.getStartTime()));
			dto.setIdProject(entity.getProjectId());
			dto.setEndTime(dateFormat.format(entity.getEndTime()));
		}
		return dto;
		
	}

	@Override
	public SideworkHistoryDto getSideWork(Long sideWorkId) {
		Optional<SideworkHistoryEntity> data = sideWorkRepository.findById(sideWorkId);		
		return mapSideworkEntityToDto(data.get());
	}
	
	private SideworkHistoryDto mapSideworkEntityToDto(SideworkHistoryEntity entity) {
		SideworkHistoryDto dto= new SideworkHistoryDto();
		dto.setEmployeehasId(entity.getIdEmployeeHasSideWorkHistory());
		dto.setEndTime(entity.getEndTime());
		dto.setId(entity.getSideworkId());
		dto.setLastUpdate(entity.getLastUpdate());
		dto.setRemark(entity.getRemark());
		dto.setStartTime(entity.getStartTime());
		dto.setWorkAnyWhere(entity.getWorkAnyWhere());
		return dto;
		
	}

	public List<CalendarDto> getSideWorkCalendar(Long employeeId) {	
		List<SideworkHistoryEntity> entity = new ArrayList<SideworkHistoryEntity>();
		try {
			entity = sideWorkRepository.getSideworkAll(employeeId);	
		}catch (Exception e) { 
			log.error("getEmployeeByNo >>> " + e.getMessage());
		}
		return mapSideworkCalendarListEntityToDto(entity);
	}

	private List<CalendarDto> mapSideworkCalendarListEntityToDto(List<SideworkHistoryEntity> entities) {
		List<CalendarDto> listDto = new ArrayList<>();
		if (!entities.isEmpty()) {
			for (SideworkHistoryEntity entitiy : entities) {
				listDto.add(mapSideworkCalendarEntityToDto(entitiy));
			}
		}
		return listDto;

	}
	
	private CalendarDto mapSideworkCalendarEntityToDto(SideworkHistoryEntity entity) {
		CalendarDto dto = new CalendarDto();
		DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
		dateFormat.setTimeZone(TimeZone.getTimeZone("GMT+7"));
		DateFormat timeFormat = new SimpleDateFormat("HH:mm");
		timeFormat.setTimeZone(TimeZone.getTimeZone("GMT+7"));
		Boolean workAnywhere = entity.getWorkAnyWhere();
			dto.setId(entity.getSideworkId());
			dto.setTitle(timeFormat.format(entity.getStartTime())+" ถึง  "+timeFormat.format(entity.getEndTime())+((workAnywhere == true)? " (ทำงานนอกสถานที่)" : ""));
			dto.setStart(entity.getDate());
			dto.setStartTime(entity.getStartTime());
			dto.setEndTime(entity.getEndTime());
			dto.setRemark(entity.getRemark());
			dto.setWorkAnyWhere(entity.getWorkAnyWhere());
		return dto;
	}
	
	public List<CalendarDto> getOtCalendar(Long employeeId) {	
		List<OtHistoryEntity> entity = new ArrayList<OtHistoryEntity>();
		try {
			entity = otRespository.getOtAll(employeeId);
		}catch (Exception e) { 
			log.error("getEmployeeByNo >>> " + e.getMessage());
		}
		return mapOtCalendarListEntityToDto(entity);
	}

	private List<CalendarDto> mapOtCalendarListEntityToDto(List<OtHistoryEntity> entities) {
		List<CalendarDto> listDto = new ArrayList<>();
		if (!entities.isEmpty()) {
			for (OtHistoryEntity entitiy : entities) {
				listDto.add(mapOtCalendarEntityToDto(entitiy));
			}
		}
		return listDto;

	}
	
	private CalendarDto mapOtCalendarEntityToDto(OtHistoryEntity entity) {
		CalendarDto dto = new CalendarDto();
		DateFormat timeFormat = new SimpleDateFormat("HH:mm");
		timeFormat.setTimeZone(TimeZone.getTimeZone("GMT+7"));
			dto.setId(entity.getOtHistoryId());
			dto.setTitle("OT: "+timeFormat.format(entity.getStartTime())+" ถึง  "+timeFormat.format(entity.getEndTime()));
			dto.setStart(entity.getStartTime());
//			dto.setStartTime(entity.getStartTime());
//			dto.setEndTime(entity.getEndTime());
		return dto;
		
	}
}
