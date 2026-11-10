package com.cdgs.worktime.employee;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "employee")
public class Employee {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_employee")
	private Long id;

	@Column(name = "employee_no", nullable = false, length = 45)
	private String employeeNo;

	@Column(name = "firstname", nullable = false, length = 45)
	private String firstname;

	@Column(name = "lastname", nullable = false, length = 45)
	private String lastname;

	protected Employee() {
	}

	public Employee(String employeeNo, String firstname, String lastname) {
		this.employeeNo = employeeNo;
		this.firstname = firstname;
		this.lastname = lastname;
	}

	public Long getId() {
		return id;
	}

	public String getEmployeeNo() {
		return employeeNo;
	}

	public String getFirstname() {
		return firstname;
	}

	public String getLastname() {
		return lastname;
	}
}
