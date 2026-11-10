package com.cdgs.worktime.report;

import java.time.YearMonth;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cdgs.worktime.report.ReportService.ReportFile;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

/** Organisation-wide reports. Restricted to ROLE_ADMIN by the security configuration ({@code /api/admin/**}). */
@RestController
@RequestMapping("/api/admin/reports")
public class ReportController {

	private final ReportService reports;

	public ReportController(ReportService reports) {
		this.reports = reports;
	}

	@GetMapping("/time-attendance")
	public ResponseEntity<byte[]> timeAttendance(@RequestParam @Min(2000) @Max(2200) int year,
			@RequestParam @Min(1) @Max(12) int month) {
		return download(reports.timeAttendance(YearMonth.of(year, month)));
	}

	@GetMapping("/worktime")
	public ResponseEntity<byte[]> worktime(@RequestParam @Min(2000) @Max(2200) int year,
			@RequestParam @Min(1) @Max(12) int month) {
		return download(reports.worktime(YearMonth.of(year, month)));
	}

	@GetMapping("/leave")
	public ResponseEntity<byte[]> leave(@RequestParam @Min(2000) @Max(2200) int year,
			@RequestParam @Min(1) @Max(12) int month) {
		return download(reports.leave(YearMonth.of(year, month)));
	}

	private static ResponseEntity<byte[]> download(ReportFile file) {
		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION,
						ContentDisposition.attachment().filename(file.filename()).build().toString())
				.header(HttpHeaders.CACHE_CONTROL, "no-store")
				.contentType(MediaType.parseMediaType(file.contentType())).body(file.content());
	}
}
