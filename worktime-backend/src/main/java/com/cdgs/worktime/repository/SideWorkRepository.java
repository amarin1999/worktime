package com.cdgs.worktime.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.cdgs.worktime.dto.EmployeeHasSideworkHistoryDto;
import com.cdgs.worktime.entity.EmployeeEntity;
import com.cdgs.worktime.entity.EmployeeHasSideworkHistoryEntity;
import com.cdgs.worktime.entity.SideworkHistoryEntity;

public interface SideWorkRepository extends CrudRepository<SideworkHistoryEntity, Long> {

	@Query(value = "SELECT sh.* " + "FROM worktime.sidework_history sh  "
			+ "JOIN  worktime.employee_has_sidework_history esh "
			+ "JOIN worktime.employee e WHERE e.id_employee= :id", nativeQuery = true)
	List<SideworkHistoryEntity> getSideWorkById(@Param("id") Long id);

	@Query(value = "SELECT sh.* " + "FROM worktime.sidework_history sh  "
			+ "JOIN  worktime.employee_has_sidework_history esh " 
			+ "WHERE DATE(sh.start_time) = DATE(:startTime) "
			+"and esh.employee_has_sidework_history_id=:employeeId", nativeQuery = true)
	SideworkHistoryEntity findDateTime(Date startTime, Long employeeId);
	


	@Query(value = "SELECT sh.* " + "FROM worktime.sidework_history sh  "
			+ "JOIN  worktime.employee_has_sidework_history esh " 
			+ "WHERE DATE(sh.start_time) = :sideWorkDate "
			+"and esh.employee_id=:employeeId", nativeQuery = true)
	SideworkHistoryEntity findDateTimeByString(String sideWorkDate, Long employeeId);
}
