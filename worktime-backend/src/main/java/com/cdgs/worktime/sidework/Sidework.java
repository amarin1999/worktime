package com.cdgs.worktime.sidework;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

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

/** A work-anywhere (WFH / site / other) time entry for one day. Table {@code sidework_history}. */
@Entity
@Table(name = "sidework_history")
public class Sidework {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_sidework_history")
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "employee_has_sidework_history_id", nullable = false)
	private WorkHistory history;

	@Column(name = "`day`")
	private LocalDate date;

	@Column(name = "start_time", nullable = false)
	private LocalTime startTime;

	@Column(name = "end_time")
	private LocalTime endTime;

	@Column(name = "work_comment", length = 250)
	private String remark;

	@Column(name = "work_anywhere")
	private Integer workAnywhere;

	@Column(name = "last_update_time", nullable = false)
	private LocalDateTime lastUpdate;

	protected Sidework() {
	}

	public Sidework(WorkHistory history) {
		this.history = history;
	}

	public void update(SideworkRequest request, LocalDateTime now) {
		this.date = request.date();
		this.startTime = request.startTime();
		this.endTime = request.endTime();
		this.workAnywhere = request.workAnywhere();
		this.remark = request.remark();
		this.lastUpdate = now;
	}

	public Long getId() {
		return id;
	}

	public WorkHistory getHistory() {
		return history;
	}

	public LocalDate getDate() {
		return date;
	}

	public LocalTime getStartTime() {
		return startTime;
	}

	public LocalTime getEndTime() {
		return endTime;
	}

	public String getRemark() {
		return remark;
	}

	public Integer getWorkAnywhere() {
		return workAnywhere;
	}

	public LocalDateTime getLastUpdate() {
		return lastUpdate;
	}
}
