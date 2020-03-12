package com.cdgs.worktime.repository;

import org.springframework.data.repository.CrudRepository;

import com.cdgs.worktime.entity.EmployeeEntity;
import com.cdgs.worktime.entity.EmployeeHasSideworkHistoryEntity;

public interface EmployeeHasSideworkHistoryRespository extends CrudRepository<EmployeeHasSideworkHistoryEntity, Long>  {


	
}
