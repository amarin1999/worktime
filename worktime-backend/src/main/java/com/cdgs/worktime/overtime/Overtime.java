package com.cdgs.worktime.overtime;

import java.time.LocalDateTime;

import com.cdgs.worktime.history.WorkHistory;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/** An overtime entry. Table {@code ot_history}. */
@Entity
@Table(name = "ot_history")
public class Overtime {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_ot_history")
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "employee_has_sidework_history_id", nullable = false)
	private WorkHistory history;

	@Column(name = "start_time", nullable = false)
	private LocalDateTime startTime;

	@Column(name = "end_time")
	private LocalDateTime endTime;

	@Column(name = "remark", length = 45)
	private String remark;

	@Column(name = "id_project")
	private String projectNo;

	@Column(name = "last_update_time", nullable = false)
	private LocalDateTime lastUpdate;

	protected Overtime() {
	}

	public Overtime(WorkHistory history) {
		this.history = history;
	}

	public void update(String projectNo, String remark, LocalDateTime startTime, LocalDateTime endTime,
			LocalDateTime now) {
		this.projectNo = projectNo;
		this.remark = remark;
		this.startTime = startTime;
		this.endTime = endTime;
		this.lastUpdate = now;
	}

	public Long getId() {
		return id;
	}

	public WorkHistory getHistory() {
		return history;
	}

	public LocalDateTime getStartTime() {
		return startTime;
	}

	public LocalDateTime getEndTime() {
		return endTime;
	}

	public String getRemark() {
		return remark;
	}

	public String getProjectNo() {
		return projectNo;
	}

	public LocalDateTime getLastUpdate() {
		return lastUpdate;
	}
}
