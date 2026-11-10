package com.cdgs.worktime.history;

import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkHistoryRepository extends JpaRepository<WorkHistory, Long> {
}
