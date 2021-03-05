package com.cdgs.worktime.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "employee")
@Embeddable
@Getter
@Setter
@ToString
public class EmployeeEntity implements Serializable {
	/**
	* 
	*/
	private static final long serialVersionUID = 1003970960014801827L;

	public Long getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(Long employeeId) {
		this.employeeId = employeeId;
	}

	public String getEmployeeno() {
		return employeeno;
	}

	public void setEmployeeno(String employeeno) {
		this.employeeno = employeeno;
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
	
	public String getActive() {
		return active;
	}

	public void setActive(String active) {
		this.active = active;
	}

	public String getAccessReport() {
		return accessReport;
	}

	public void setAccessReport(String accessReport) {
		this.accessReport = accessReport;
	}

	@Id
	@Column(name = "id_employee")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long employeeId;

	@Column(name = "employee_no", unique = true)
	private String employeeno;

	@Column(name = "firstname", unique = true)
	private String firstname;

	@Column(name = "lastname", unique = true)
	private String lastname;
	
	@Column(name = "active")
	private String active;
	
	@Column(name = "access_report")
	private String accessReport;

}
