package com.cdgs.worktime.sidework;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

public record SideworkResponse(
		Long id,
		LocalDate date,
		@JsonFormat(pattern = "HH:mm") LocalTime startTime,
		@JsonFormat(pattern = "HH:mm") LocalTime endTime,
		Integer workAnywhere,
		String remark,
		@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime lastUpdate) {

	static SideworkResponse of(Sidework s) {
		return new SideworkResponse(s.getId(), s.getDate(), s.getStartTime(), s.getEndTime(), s.getWorkAnywhere(),
				s.getRemark(), s.getLastUpdate());
	}
}
