package com.cdgs.worktime.dto;

import java.io.Serializable;

import java.util.Date;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class EmployeeDto implements Serializable {
	
	private static final long serialVersionUID = 4117251794789698554L;
	
	private Long id ;
	private String no;
	private String firstname;
	private String lastname;
	private String accessReport;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getNo() {
		return no;
	}
	public void setNo(String no) {
		this.no = no;
	}
	public String getFirstname() {
		return firstname;
	}
	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}
	public String getLastname() {
		return lastname;
	}
	public void setLastname(String lastname) {
		this.lastname = lastname;
	}
	public String getAccessReport() {
		return accessReport;
	}
	public void setAccessReport(String accessReport) {
		this.accessReport = accessReport;
	}



}
