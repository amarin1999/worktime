package com.cdgs.worktime.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.cdgs.worktime.entity.SideworkHistoryEntity;

public interface DataTableRespository extends CrudRepository<SideworkHistoryEntity, Long> {

	@Query(value = "SELECT sh.* " + "FROM worktime.sidework_history sh  "
			+ "JOIN  worktime.employee_has_sidework_history esh "
			+ "JOIN worktime.employee e WHERE e.id_employee= :employeeId"
			+"AND esh.work_type = 1 ",nativeQuery = true)
	List<SideworkHistoryEntity> getSideWorkData(Long employeeId);
}
