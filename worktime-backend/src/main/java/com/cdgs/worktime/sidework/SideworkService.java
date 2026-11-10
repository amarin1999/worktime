package com.cdgs.worktime.sidework;

import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cdgs.worktime.common.BadRequestException;
import com.cdgs.worktime.common.NotFoundException;
import com.cdgs.worktime.employee.Employee;
import com.cdgs.worktime.employee.EmployeeRepository;
import com.cdgs.worktime.history.WorkHistory;
import com.cdgs.worktime.history.WorkHistoryRepository;

@Service
@Transactional(readOnly = true)
public class SideworkService {

	private final SideworkRepository sideworks;
	private final WorkHistoryRepository histories;
	private final EmployeeRepository employees;
	private final Clock clock;

	public SideworkService(SideworkRepository sideworks, WorkHistoryRepository histories,
			EmployeeRepository employees, Clock clock) {
		this.sideworks = sideworks;
		this.histories = histories;
		this.employees = employees;
		this.clock = clock;
	}

	public List<SideworkResponse> list(long employeeId) {
		return sideworks.findByHistory_Employee_IdOrderByDateDescStartTimeDesc(employeeId).stream()
				.map(SideworkResponse::of).toList();
	}

	public SideworkResponse get(long employeeId, long id) {
		return SideworkResponse.of(owned(employeeId, id));
	}

	public SideworkResponse getByDate(long employeeId, LocalDate date) {
		return sideworks.findFirstByHistory_Employee_IdAndDate(employeeId, date).map(SideworkResponse::of)
				.orElseThrow(NotFoundException::new);
	}

	/** Creates the day's entry, or updates it if the employee already has one for that date. */
	@Transactional
	public SideworkResponse save(long employeeId, SideworkRequest request) {
		Sidework sidework = sideworks.findFirstByHistory_Employee_IdAndDate(employeeId, request.date())
				.orElseGet(() -> {
					Employee employee = employees.getReferenceById(employeeId);
					return new Sidework(histories.save(new WorkHistory(employee, WorkHistory.SIDEWORK)));
				});
		sidework.update(request, LocalDateTime.now(clock));
		return SideworkResponse.of(sideworks.save(sidework));
	}

	@Transactional
	public SideworkResponse update(long employeeId, long id, SideworkRequest request) {
		Sidework sidework = owned(employeeId, id);
		sideworks.findFirstByHistory_Employee_IdAndDate(employeeId, request.date())
				.filter(other -> !other.getId().equals(sidework.getId()))
				.ifPresent(other -> {
					throw new BadRequestException("มีการลงเวลาของวันที่นี้แล้ว");
				});
		sidework.update(request, LocalDateTime.now(clock));
		return SideworkResponse.of(sidework);
	}

	@Transactional
	public void delete(long employeeId, long id) {
		Sidework sidework = owned(employeeId, id);
		WorkHistory history = sidework.getHistory();
		sideworks.delete(sidework);
		sideworks.flush();
		if (sideworks.countByHistory_Id(history.getId()) == 0) {
			histories.delete(history);
		}
	}

	private Sidework owned(long employeeId, long id) {
		return sideworks.findByIdAndHistory_Employee_Id(id, employeeId).orElseThrow(NotFoundException::new);
	}
}
