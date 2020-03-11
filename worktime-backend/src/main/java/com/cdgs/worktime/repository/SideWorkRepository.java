package com.cdgs.worktime.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.cdgs.worktime.dto.EmployeeHasSideworkHistoryDto;
import com.cdgs.worktime.entity.EmployeeEntity;
import com.cdgs.worktime.entity.EmployeeHasSideworkHistoryEntity;
import com.cdgs.worktime.entity.SideworkHistoryEntity;

public interface SideWorkRepository extends CrudRepository<SideworkHistoryEntity, Long> {

	@Query(value = "SELECT sh.* "
			+ "FROM worktime.sidework_history sh  "
			+ "JOIN  worktime.employee_has_sidework_history esh " + 
			"JOIN worktime.employee e WHERE e.id_employee= :id", nativeQuery = true)
	List<SideworkHistoryEntity> getSideWorkById(@Param("id") Long id);
}
