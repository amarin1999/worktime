package com.cdgs.worktime.employee;

import java.time.LocalDateTime;

public record EmployeeByDay(String employeeNo, String firstname, String lastname, Integer workAnywhere,
		String remark, LocalDateTime lastUpdateTime) {
}
