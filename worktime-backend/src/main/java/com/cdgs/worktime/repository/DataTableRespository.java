package com.cdgs.worktime.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.cdgs.worktime.entity.EmployeeEntity;
import com.cdgs.worktime.entity.SideworkHistoryEntity;

public interface DataTableRespository extends CrudRepository<SideworkHistoryEntity, String> {

	@Query(value = "SELECT sh.* " + "FROM worktime.sidework_history sh  "
			+ "JOIN worktime.employee e "
			+"JOIN  worktime.employee_has_sidework_history esh " 
			+ "WHERE e.id_employee = :employeeId "
			+ "and esh.work_type= 1 ", nativeQuery = true)
	List<SideworkHistoryEntity> getSideworkAll(Long employeeId);
}
