package com.cdgs.worktime.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.cdgs.worktime.entity.OtHistoryEntity;

public interface OtRespositiry extends CrudRepository<OtHistoryEntity, Long> {

	@Query(value = " SELECT ot.*" + "FROM ot_history ot LEFT JOIN  worktime.employee_has_sidework_history esh "
			+ "ON ot.employee_has_sidework_history_id = esh.employee_has_sidework_history_id "
			+ "WHERE esh.employee_id = :employeeId", nativeQuery = true)
	List<OtHistoryEntity> getOtAll(@Param(value = "employeeId") Long employeeId);

	@Query(value = " SELECT ot.*" + "FROM ot_history ot " + "WHERE ot.id_project = :otId", nativeQuery = true)
	OtHistoryEntity getOtById(@Param(value = "otId") Long otId);

}
