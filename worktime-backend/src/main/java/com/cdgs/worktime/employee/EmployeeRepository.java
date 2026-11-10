package com.cdgs.worktime.employee;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

	Optional<Employee> findFirstByEmployeeNoIgnoreCase(String employeeNo);

	@Query("""
			select new com.cdgs.worktime.employee.EmployeeByDay(
			    e.employeeNo, e.firstname, e.lastname, s.workAnywhere, s.remark, s.lastUpdate)
			from Sidework s join s.history h join h.employee e
			where h.workType = 1 and s.date = :date
			  and (:workAnywhere is null or s.workAnywhere = :workAnywhere)
			order by e.employeeNo
			""")
	List<EmployeeByDay> findWorkingOn(@Param("date") LocalDate date, @Param("workAnywhere") Integer workAnywhere);
}
