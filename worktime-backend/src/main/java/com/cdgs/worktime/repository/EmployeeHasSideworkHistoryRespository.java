package com.cdgs.worktime.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.PathVariable;

import com.cdgs.worktime.dto.EmployeeByDayDto;
import com.cdgs.worktime.dto.EmployeeDayDto;
import com.cdgs.worktime.dto.EmployeeDto;
import com.cdgs.worktime.entity.EmployeeEntity;
import com.cdgs.worktime.entity.EmployeeHasSideworkHistoryEntity;

public interface EmployeeHasSideworkHistoryRespository extends CrudRepository<EmployeeHasSideworkHistoryEntity, Long>  {

	@Query(value = "select employee_no as employeeNo, firstname, lastname, work_anywhere as workAnywhere, work_comment as remark" + 
			" from worktime.employee as e " + 
			" inner join worktime.employee_has_sidework_history as esh " + 
			" on e.id_employee = esh.employee_id " + 
			" inner join worktime.sidework_history as sh " + 
			" on esh.employee_has_sidework_history_id = sh.employee_has_sidework_history_id " + 
			" WHERE work_type = 1 and YEAR(`day`) =:year  and MONTH(`day`) =:month and day(`day`) =:day and work_anywhere =:work " + 
			" ORDER BY `day`, start_time ASC ", nativeQuery = true)
	List<EmployeeByDayDto> findByDay(@Param(value = "year") String year,
			@Param(value = "month") String month,
			@Param(value = "day") String day,
			@Param(value = "work") Long work
			);
	
}
