package com.cdgs.worktime.dto;

import java.io.Serializable;
import java.sql.Date;

import javax.swing.border.TitledBorder;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data

@NoArgsConstructor
public  class LeaveEmployeeDto implements Serializable {
	private static final long serialVersionUID = 7900738635522301915L;
	private String title;
	private java.util.Date start;
	private String type;

				
					
		
	public String getType() {
		return type;
	}


	public void setType(String type) {
		this.type = type;
	}


	public LeaveEmployeeDto(String title, java.util.Date start,String type ) {
		super();
		this.title = title;
		this.start = start;
		this.type = type;
	}


	public String getTitle() {
		return title;
	}



	public void setTitle(String title) {
		this.title = title;
	}



	public java.util.Date getStart() {
		return start;
	}



	public void setStart(java.util.Date start) {
		this.start = start;
	}



	public static long getSerialversionuid() {
		return serialVersionUID;
	}



	

}
