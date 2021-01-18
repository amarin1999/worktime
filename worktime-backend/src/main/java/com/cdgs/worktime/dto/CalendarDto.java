package com.cdgs.worktime.dto;

import java.io.Serializable;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CalendarDto implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 2035968167410884038L;
	
	private Long id;
	private String title;
	private Date start;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public Date getStart() {
		return start;
	}
	public void setStart(Date start) {
		this.start = start;
	}
	public Date getEnd() {
		return end;
	}
	public void setEnd(Date end) {
		this.end = end;
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
	private Date end;
	private Date startTime;
	private Date endTime;
	private String remark;
	private Integer workAnyWhere;
}
