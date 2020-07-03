package com.cdgs.worktime.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.cdgs.worktime.dto.EmployeeHasSideworkHistoryDto;
import com.cdgs.worktime.entity.EmployeeEntity;
import com.cdgs.worktime.entity.EmployeeHasSideworkHistoryEntity;
import com.cdgs.worktime.entity.OtHistoryEntity;
import com.cdgs.worktime.entity.SideworkHistoryEntity;

public interface SideWorkRepository extends CrudRepository<SideworkHistoryEntity, Long> {

	@Query(value = "SELECT sh.* " + "FROM worktime.sidework_history sh  "
			+ "JOIN  worktime.employee_has_sidework_history esh "
			+ "JOIN worktime.employee e WHERE e.id_employee= :id", nativeQuery = true)
	SideworkHistoryEntity getSideWorkById(@Param("id") Long id);

	@Query(value = "SELECT sh.* " + "FROM worktime.sidework_history sh  "
			+ "INNER JOIN  worktime.employee_has_sidework_history esh    "
			+ " ON sh.employee_has_sidework_history_id = esh.employee_has_sidework_history_id " 
			+ "WHERE sh.day = :sideWorkDate "
			+"and esh.employee_id=:employeeId", nativeQuery = true)
	SideworkHistoryEntity findDateTimeByString(String sideWorkDate, Long employeeId);
	
	@Query(value =" SELECT sh.* "
			+ "FROM worktime.sidework_history sh INNER JOIN  worktime.employee_has_sidework_history esh "
			+"ON sh.employee_has_sidework_history_id = esh.employee_has_sidework_history_id "
			+ "WHERE esh.employee_id = :employeeId"	, nativeQuery = true)
	List<SideworkHistoryEntity> getSideworkAll(@Param(value = "employeeId") Long employeeId);
	
	@Query(value = " SELECT sw.*" + "FROM sidework_history sw " + "WHERE sw.id_sidework_history = :sideworkId", nativeQuery = true)
	SideworkHistoryEntity getSideWorkIdById(@Param(value = "sideworkId") Long sideworkId);
	
	@Modifying
	@Transactional
	@Query(value = " DELETE FROM sidework_history WHERE sidework_history.id_sidework_history = :sideworkId", nativeQuery = true)
	Integer deleteSideWorkById(@Param(value = "sideworkId") Long sideworkId);
	
}
