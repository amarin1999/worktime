package com.cdgs.worktime.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class EmployeeHasSideworkHistoryDto {

	private Long employee_id;
	private Long sidework_history_id;
	private String work_type;
	private Long work_project_id;
}
