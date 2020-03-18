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
	

}
