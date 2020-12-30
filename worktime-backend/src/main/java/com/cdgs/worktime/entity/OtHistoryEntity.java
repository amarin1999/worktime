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
@Table(name = "ot_history")
@Embeddable
@Getter
@Setter
@ToString
public class OtHistoryEntity implements Serializable{/**
	 * 
	 */
	private static final long serialVersionUID = -7077673124003186928L;

	@Id
	@Column(name ="id_ot_history")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long otHistoryId;
	
	public Long getOtHistoryId() {
		return otHistoryId;
	}


	public void setOtHistoryId(Long otHistoryId) {
		this.otHistoryId = otHistoryId;
	}


	public Long getEmployeeHasSideworkId() {
		return employeeHasSideworkId;
	}


	public void setEmployeeHasSideworkId(Long employeeHasSideworkId) {
		this.employeeHasSideworkId = employeeHasSideworkId;
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


	public Date getLastUpDate() {
		return lastUpDate;
	}


	public void setLastUpDate(Date lastUpDate) {
		this.lastUpDate = lastUpDate;
	}


	public String getProjectId() {
		return projectId;
	}


	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}


	public EmployeeHasSideworkHistoryEntity getIdEmployeeHasSideworkId() {
		return idEmployeeHasSideworkId;
	}


	public void setIdEmployeeHasSideworkId(EmployeeHasSideworkHistoryEntity idEmployeeHasSideworkId) {
		this.idEmployeeHasSideworkId = idEmployeeHasSideworkId;
	}


	@Column(name="employee_has_sidework_history_id")
	private Long employeeHasSideworkId; 
	
	@Column(name = "start_time")
	@Temporal(TemporalType.TIMESTAMP)
	private Date startTime;
	
	@Column(name = "end_time")
	@Temporal(TemporalType.TIMESTAMP)
	private Date endTime;
	
	@Column(name = "remark")
	private String remark;
	
	@Column(name = "last_update_time")
	@Temporal(TemporalType.TIMESTAMP)
	private Date lastUpDate;
	
	@Column(name = "id_project")
	private String projectId;
	
	
	@ManyToOne
	@JoinColumn(name = "employee_has_sidework_history_id", insertable = false, updatable = false)
	private EmployeeHasSideworkHistoryEntity idEmployeeHasSideworkId;
	

}
