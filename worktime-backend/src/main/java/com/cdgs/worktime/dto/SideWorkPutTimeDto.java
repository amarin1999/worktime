package com.cdgs.worktime.dto;

import java.io.Serializable;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class SideWorkPutTimeDto implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 8886815346590834119L;
	
	private Long id;
	private String startTime;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
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
	public Integer getWorkAnyWhere() {
		return workAnyWhere;
	}
	public void setWorkAnyWhere(Integer workAnyWhere) {
		this.workAnyWhere = workAnyWhere;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	private String endTime;
	private Integer workAnyWhere;
	private String remark;
	
}
