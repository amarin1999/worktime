package com.cdgs.worktime.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.cdgs.worktime.entity.EmployeeEntity;

public interface EmployeeRespository extends CrudRepository<EmployeeEntity, Long> {

	@Query(value = "SELECT * FROM employee where employee_no = :no", nativeQuery = true)
	List<EmployeeEntity> findByNo(@Param("no") String no);
	
	@Query(value = "SELECT * FROM employee where access_report != :accessReport", nativeQuery = true)
	List<EmployeeEntity> findByAllAccessReport(@Param("accessReport") String accessReport);
	
	@Query(value = "SELECT * FROM employee where access_report = :accessReport", nativeQuery = true)
	List<EmployeeEntity> findByAccessReport(@Param("accessReport") String accessReport);
		
	@Query(value = "select *  from employee", nativeQuery = true)
	List<EmployeeEntity> selectEmployeeNo();
}
