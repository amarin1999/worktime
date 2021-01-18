package com.cdgs.worktime.dto;

import com.cdgs.worktime.entity.EmployeeEntity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class EmployeeHasSideworkHistoryDto {

	private Long employeeId;
	private Long employeehasId;
	private Long workType;
	public Long getEmployeeId() {
		return employeeId;
	}
	public void setEmployeeId(Long employeeId) {
		this.employeeId = employeeId;
	}
	public Long getEmployeehasId() {
		return employeehasId;
	}
	public void setEmployeehasId(Long employeehasId) {
		this.employeehasId = employeehasId;
	}
	public Long getWorkType() {
		return workType;
	}
	public void setWorkType(Long workType) {
		this.workType = workType;
	}

	

}
