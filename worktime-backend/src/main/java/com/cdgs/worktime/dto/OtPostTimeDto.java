package com.cdgs.worktime.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class OtPostTimeDto implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -5060788856760595411L;

	private Long id;
	private Long employeehasId;

	private List<TimeListDto> timeRange;
	private String remark;
	private Date lastUpdate;
	private String projectNo;
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
	public List<TimeListDto> getTimeRange() {
		return timeRange;
	}
	public void setTimeRange(List<TimeListDto> timeRange) {
		this.timeRange = timeRange;
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
	public String getProjectNo() {
		return projectNo;
	}
	public void setProjectNo(String projectNo) {
		this.projectNo = projectNo;
	}

	public String getEmployeeNo() {
		return employeeNo;
	}
	public void setEmployeeNo(String employeeNo) {
		this.employeeNo = employeeNo;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	private String employeeNo;
}
