package com.cdgs.worktime.calendar;

import java.time.LocalDate;
import java.time.Year;
import java.time.YearMonth;
import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cdgs.worktime.isservice.IsServiceClient;
import com.cdgs.worktime.security.CurrentUser;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

/** Holidays and leaves of the current user, read from the CDG IS service. */
@RestController
@RequestMapping("/api")
public class CalendarController {

	public record HolidayResponse(String title, LocalDate date) {
	}

	public record LeaveResponse(String title, LocalDate date, String type) {
	}

	private final IsServiceClient isService;

	public CalendarController(IsServiceClient isService) {
		this.isService = isService;
	}

	@GetMapping("/holidays")
	public List<HolidayResponse> holidays(@AuthenticationPrincipal CurrentUser user,
			@RequestParam @Min(2000) @Max(2200) int year) {
		Year y = Year.of(year);
		return isService.getHolidays(user.employeeNo(), y.atDay(1), y.atMonth(12).atEndOfMonth()).stream()
				.map(h -> new HolidayResponse(h.name(), h.date())).toList();
	}

	@GetMapping("/leaves")
	public List<LeaveResponse> leaves(@AuthenticationPrincipal CurrentUser user,
			@RequestParam @Min(2000) @Max(2200) int year,
			@RequestParam(required = false) @Min(1) @Max(12) Integer month) {
		LocalDate start = month == null ? Year.of(year).atDay(1) : YearMonth.of(year, month).atDay(1);
		LocalDate end = month == null ? Year.of(year).atMonth(12).atEndOfMonth()
				: YearMonth.of(year, month).atEndOfMonth();
		return isService.getLeaves(user.employeeNo(), start, end).stream()
				.map(l -> new LeaveResponse(l.title(), l.date(), l.type())).toList();
	}
}
