package com.cdgs.worktime.sidework;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SideworkRequest(
		@NotNull LocalDate date,
		@NotNull @JsonFormat(pattern = "HH:mm") LocalTime startTime,
		@NotNull @JsonFormat(pattern = "HH:mm") LocalTime endTime,
		@NotNull @Min(1) @Max(4) Integer workAnywhere,
		@Size(max = 250) String remark) {

	@AssertTrue(message = "endTime must be after startTime")
	public boolean isTimeRangeValid() {
		return startTime == null || endTime == null || endTime.isAfter(startTime);
	}
}
