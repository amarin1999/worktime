package com.cdgs.worktime.report;

import java.nio.charset.StandardCharsets;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import org.springframework.stereotype.Service;

import com.cdgs.worktime.isservice.IsServiceClient;
import com.cdgs.worktime.isservice.IsServiceException;
import com.cdgs.worktime.report.LeaveExcelReport.LeaveEntry;
import com.cdgs.worktime.report.ReportRepository.EmployeeRow;

@Service
public class ReportService {

	/** Parallel calls to the IS service when building the leave report (one call per employee). */
	private static final int IS_SERVICE_CONCURRENCY = 8;

	public record ReportFile(String filename, String contentType, byte[] content) {
	}

	private static final String XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

	private final ReportRepository repository;
	private final IsServiceClient isService;

	public ReportService(ReportRepository repository, IsServiceClient isService) {
		this.repository = repository;
		this.isService = isService;
	}

	public ReportFile timeAttendance(YearMonth month) {
		String content = TimeAttendanceExport.build(repository.sideworkIn(month));
		return new ReportFile("add-workanywhere-%d%02d.dat".formatted(month.getYear(), month.getMonthValue()),
				"text/plain;charset=UTF-8", content.getBytes(StandardCharsets.UTF_8));
	}

	public ReportFile worktime(YearMonth month) {
		byte[] xlsx = WorktimeExcelReport.build(month, repository.activeEmployees(), repository.sideworkIn(month));
		return new ReportFile("worktimeExcel%d%02d.xlsx".formatted(month.getYear(), month.getMonthValue()), XLSX,
				xlsx);
	}

	public ReportFile leave(YearMonth month) {
		List<EmployeeRow> employees = repository.realEmployees();
		List<LeaveEntry> entries = new ArrayList<>();
		try (ExecutorService pool = Executors.newFixedThreadPool(IS_SERVICE_CONCURRENCY)) {
			List<Future<List<LeaveEntry>>> futures = employees.stream()
					.map(e -> pool.submit(() -> isService
							.getLeaves(e.employeeNo(), month.atDay(1), month.atEndOfMonth()).stream()
							.map(l -> new LeaveEntry(e.firstname() + " " + e.lastname(), l.date(), l.type()))
							.toList()))
					.toList();
			for (Future<List<LeaveEntry>> f : futures) {
				entries.addAll(f.get());
			}
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
			throw new IsServiceException("leave report interrupted", e);
		} catch (ExecutionException e) {
			throw e.getCause() instanceof IsServiceException ise ? ise
					: new IsServiceException("leave report failed", e.getCause());
		}
		return new ReportFile("leaveEmployee%d%02d.xlsx".formatted(month.getYear(), month.getMonthValue()), XLSX,
				LeaveExcelReport.build(month, entries));
	}
}
