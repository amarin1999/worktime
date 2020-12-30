package com.cdgs.worktime.dto;

import java.io.Serializable;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class SideworkDateToSting implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -765739394950691690L;
	
	private Long id;
	private Long employeehasId;
	private String startTime;
	private String endTime;
	private String date;
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
	public String getStartTime() {
		return startTime;
	}
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}
	public String getEndTime() {
		return endTime;
	}
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
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
	private String remark;
	private Integer workAnyWhere;
	

}
