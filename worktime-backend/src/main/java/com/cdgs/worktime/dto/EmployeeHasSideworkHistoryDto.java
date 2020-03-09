package com.cdgs.worktime.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class EmployeeHasSideworkHistoryDto {

	private Long employeeId;
	private Long sideworkHistoryId;
	private String workType;
	private Long workProjectId;
}
