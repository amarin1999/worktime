package com.cdgs.worktime.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.cdgs.worktime.entity.OtHistoryEntity;

public interface OtRespository extends CrudRepository<OtHistoryEntity, Long> {

	@Query(value = " SELECT ot.*" + "FROM ot_history ot LEFT JOIN  worktime.employee_has_sidework_history esh "
			+ "ON ot.employee_has_sidework_history_id = esh.employee_has_sidework_history_id "
			+ "WHERE esh.employee_id = :employeeId", nativeQuery = true)
	List<OtHistoryEntity> getOtAll(@Param(value = "employeeId") Long employeeId);

	@Query(value = " SELECT ot.*" + "FROM ot_history ot " + "WHERE ot.id_ot_history = :otId", nativeQuery = true)
	OtHistoryEntity getOtById(@Param(value = "otId") Long otId);

	@Modifying
	@Transactional
	@Query(value = " DELETE FROM ot_history WHERE ot_history.id_ot_history = :OtId", nativeQuery = true)
	Integer deleteOtById(@Param(value = "OtId") Long OtId);	
}
