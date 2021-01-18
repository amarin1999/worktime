package com.cdgs.worktime.dto;


import com.google.api.client.util.DateTime;

public interface EmployeeByDayDto {
	String getEmployeeNo();
	String getFirstname();
	String getLastname();
	Long getWorkAnywhere();
	String getRemark();
	String getLastUpdateTime();
}
