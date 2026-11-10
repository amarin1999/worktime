package com.cdgs.worktime.history;

import com.cdgs.worktime.employee.Employee;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Row of {@code employee_has_sidework_history}: links one sidework or overtime record to an employee.
 */
@Entity
@Table(name = "employee_has_sidework_history")
public class WorkHistory {

	public static final int SIDEWORK = 1;
	public static final int OVERTIME = 2;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "employee_has_sidework_history_id")
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "employee_id", nullable = false)
	private Employee employee;

	@Column(name = "work_type")
	private Integer workType;

	protected WorkHistory() {
	}

	public WorkHistory(Employee employee, int workType) {
		this.employee = employee;
		this.workType = workType;
	}

	public Long getId() {
		return id;
	}

	public Employee getEmployee() {
		return employee;
	}

	public Integer getWorkType() {
		return workType;
	}
}
