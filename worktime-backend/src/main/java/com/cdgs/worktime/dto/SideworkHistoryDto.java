package com.cdgs.worktime.dto;

import java.io.Serializable;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class SideworkHistoryDto implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 2035968167410884038L;
	
	private Long id;
	private Long employeehasId;
	private Date startTime;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getEmployeehasId() {
		return employeehasId;
	}
	public void setEmployeehasId(Long employeehasId) {
		this.employeehasId = employeehasId;
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
	public Date getLastUpdate() {
		return lastUpdate;
	}
	public void setLastUpdate(Date lastUpdate) {
		this.lastUpdate = lastUpdate;
	}
	public Integer getWorkAnyWhere() {
		return workAnyWhere;
	}
	public void setWorkAnyWhere(Integer workAnyWhere) {
		this.workAnyWhere = workAnyWhere;
	}
	private Date endTime;
	private String remark;
	private Date lastUpdate;
	private Integer workAnyWhere;
	
}
