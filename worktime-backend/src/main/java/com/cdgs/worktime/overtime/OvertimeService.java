package com.cdgs.worktime.overtime;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cdgs.worktime.common.NotFoundException;
import com.cdgs.worktime.employee.Employee;
import com.cdgs.worktime.employee.EmployeeRepository;
import com.cdgs.worktime.history.WorkHistory;
import com.cdgs.worktime.history.WorkHistoryRepository;
import com.cdgs.worktime.overtime.OvertimeDtos.CreateRequest;
import com.cdgs.worktime.overtime.OvertimeDtos.Response;
import com.cdgs.worktime.overtime.OvertimeDtos.TimeRange;
import com.cdgs.worktime.overtime.OvertimeDtos.UpdateRequest;

@Service
@Transactional(readOnly = true)
public class OvertimeService {

	private final OvertimeRepository overtimes;
	private final WorkHistoryRepository histories;
	private final EmployeeRepository employees;
	private final Clock clock;

	public OvertimeService(OvertimeRepository overtimes, WorkHistoryRepository histories,
			EmployeeRepository employees, Clock clock) {
		this.overtimes = overtimes;
		this.histories = histories;
		this.employees = employees;
		this.clock = clock;
	}

	public List<Response> list(long employeeId) {
		return overtimes.findByHistory_Employee_IdOrderByStartTimeDesc(employeeId).stream().map(Response::of)
				.toList();
	}

	public Response get(long employeeId, long id) {
		return Response.of(owned(employeeId, id));
	}

	/** Saves one overtime record per time range (v1 only saved the last range because it reused one entity). */
	@Transactional
	public List<Response> create(long employeeId, CreateRequest request) {
		Employee employee = employees.getReferenceById(employeeId);
		LocalDateTime now = LocalDateTime.now(clock);
		List<Response> created = new ArrayList<>();
		for (TimeRange range : request.timeRange()) {
			Overtime overtime = new Overtime(histories.save(new WorkHistory(employee, WorkHistory.OVERTIME)));
			overtime.update(request.projectNo(), request.remark(), range.startTime(), range.endTime(), now);
			created.add(Response.of(overtimes.save(overtime)));
		}
		return created;
	}

	@Transactional
	public Response update(long employeeId, long id, UpdateRequest request) {
		Overtime overtime = owned(employeeId, id);
		overtime.update(request.projectNo(), request.remark(), request.startTime(), request.endTime(),
				LocalDateTime.now(clock));
		return Response.of(overtime);
	}

	@Transactional
	public void delete(long employeeId, long id) {
		Overtime overtime = owned(employeeId, id);
		WorkHistory history = overtime.getHistory();
		overtimes.delete(overtime);
		overtimes.flush();
		// v1 records may share one history row between several overtime entries; only drop it when unused
		if (overtimes.countByHistory_Id(history.getId()) == 0) {
			histories.delete(history);
		}
	}

	private Overtime owned(long employeeId, long id) {
		return overtimes.findByIdAndHistory_Employee_Id(id, employeeId).orElseThrow(NotFoundException::new);
	}
}
