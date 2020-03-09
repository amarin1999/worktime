package com.cdgs.worktime.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.cdgs.worktime.entity.EmployeeEntity;

public interface EmployeeRespository extends CrudRepository<EmployeeEntity, String> {

	@Query(value = "SELECT * FROM employee where employee_no = :no", nativeQuery = true)
	List<EmployeeEntity> findByNo(@Param("no") String no);
}
