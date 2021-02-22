package com.cdgs.worktime.dto;

import java.io.Serializable;
import java.sql.Date;

import javax.swing.border.TitledBorder;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data

@NoArgsConstructor
public class LeaveYearEmployeeDto {
	private static final long serialVersionUID = 7900738635522301915L;
	private String title;
	private String start;
	private String type;
	private String remark;
	private String employeeNo;
	private String section_leave;
	private String firstname;
	private String lastname;

				
					
	public String getType() {
		return type;
	}


	public void setType(String type) {
		this.type = type;
	}


	public LeaveYearEmployeeDto(String title, String start, String type, String reason, String emp_no, String section_leave, String firstname, String lastname) {
		super();
		this.employeeNo = emp_no;
		this.firstname = firstname;
		this.lastname = lastname;
		this.title = title;
		this.start = start;
		this.type = type;
		this.remark = reason;
		this.section_leave = section_leave;
	}


	public String getTitle() {
		return title;
	}



	public void setTitle(String title) {
		this.title = title;
	}



	public String getStart() {
		return start;
	}



	public void setStart(String start) {
		this.start = start;
	}



	public static long getSerialversionuid() {
		return serialVersionUID;
	}


	public String getRemark() {
		return remark;
	}


	public void setRemark(String remark) {
		this.remark = remark;
	}


	public String getEmployeeNo() {
		return employeeNo;
	}


	public void setEmployeeNo(String employeeNo) {
		this.employeeNo = employeeNo;
	}


	public String getSection_leave() {
		return section_leave;
	}


	public void setSection_leave(String section_leave) {
		this.section_leave = section_leave;
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
	
	
	
	



	

}
