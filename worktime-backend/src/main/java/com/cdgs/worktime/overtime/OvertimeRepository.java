package com.cdgs.worktime.overtime;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OvertimeRepository extends JpaRepository<Overtime, Long> {

	List<Overtime> findByHistory_Employee_IdOrderByStartTimeDesc(Long employeeId);

	/** Ownership-checked lookup: empty when the record belongs to someone else. */
	Optional<Overtime> findByIdAndHistory_Employee_Id(Long id, Long employeeId);

	long countByHistory_Id(Long historyId);
}
