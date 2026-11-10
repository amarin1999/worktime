package com.cdgs.worktime.sidework;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SideworkRepository extends JpaRepository<Sidework, Long> {

	List<Sidework> findByHistory_Employee_IdOrderByDateDescStartTimeDesc(Long employeeId);

	Optional<Sidework> findFirstByHistory_Employee_IdAndDate(Long employeeId, LocalDate date);

	/** Ownership-checked lookup: empty when the record belongs to someone else. */
	Optional<Sidework> findByIdAndHistory_Employee_Id(Long id, Long employeeId);

	long countByHistory_Id(Long historyId);
}
