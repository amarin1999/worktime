package com.cdgs.worktime.employee;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

	private final EmployeeRepository employees;

	public EmployeeController(EmployeeRepository employees) {
		this.employees = employees;
	}

	/** Who is working anywhere on the given day (shown to every logged-in employee, as in v1). */
	@GetMapping("/by-day")
	public List<EmployeeByDay> byDay(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
			@RequestParam(required = false) @Min(1) @Max(4) Integer workAnywhere) {
		return employees.findWorkingOn(date, workAnywhere);
	}
}
