package com.cdgs.worktime.entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "sidework_history")
@Embeddable
@Getter
@Setter
@ToString
public class SideworkHistoryEntity implements Serializable {
	/**
	* 
	*/
	private static final long serialVersionUID = -3425483119931380227L;

	@Id
	@Column(name = "id_sidework_history")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long sideworkId;

	@Column(name = "employee_has_sidework_history_id")
	private Long idEmployeeHasSideWorkHistory;

	@ManyToOne
	@JoinColumn(name = "employee_has_sidework_history_id", insertable = false, updatable = false)
	private EmployeeHasSideworkHistoryEntity employeeHasSideworkHistoryId;

	@Column(name = "start_time")
	@Temporal(TemporalType.TIMESTAMP)
	private Date startTime;

	@Column(name = "end_time")
	@Temporal(TemporalType.TIMESTAMP)
	private Date endTime;

	@Column(name = "work_comment")
	private String remark;

	public Long getSideworkId() {
		return sideworkId;
	}

	public void setSideworkId(Long sideworkId) {
		this.sideworkId = sideworkId;
	}

	public Long getIdEmployeeHasSideWorkHistory() {
		return idEmployeeHasSideWorkHistory;
	}

	public void setIdEmployeeHasSideWorkHistory(Long idEmployeeHasSideWorkHistory) {
		this.idEmployeeHasSideWorkHistory = idEmployeeHasSideWorkHistory;
	}

	public EmployeeHasSideworkHistoryEntity getEmployeeHasSideworkHistoryId() {
		return employeeHasSideworkHistoryId;
	}

	public void setEmployeeHasSideworkHistoryId(EmployeeHasSideworkHistoryEntity employeeHasSideworkHistoryId) {
		this.employeeHasSideworkHistoryId = employeeHasSideworkHistoryId;
	}

	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Integer getWorkAnyWhere() {
		return workAnyWhere;
	}

	public void setWorkAnyWhere(Integer workAnyWhere) {
		this.workAnyWhere = workAnyWhere;
	}

	public Date getLastUpdate() {
		return lastUpdate;
	}

	public void setLastUpdate(Date lastUpdate) {
		this.lastUpdate = lastUpdate;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	@Column(name = "work_anywhere")
	private Integer workAnyWhere;

	@Column(name = "last_update_time")
	@Temporal(TemporalType.TIMESTAMP)
	private Date lastUpdate;
	
	@Column(name = "day")
	@Temporal(TemporalType.TIMESTAMP)
	private Date date;

}
