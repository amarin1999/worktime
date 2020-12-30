package com.cdgs.worktime.dto;

import java.io.Serializable;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class HolidayDto implements Serializable {

private static final long serialVersionUID = 7900738635522301915L;
	
	private String title;
	private Date start;
	public HolidayDto(String title, Date start) {
		super();
		this.title = title;
		this.start = start;
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
	
}
