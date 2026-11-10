package com.cdgs.worktime.overtime;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Request/response records for the overtime API. */
public final class OvertimeDtos {

	private OvertimeDtos() {
	}

	private static final String DATE_TIME = "yyyy-MM-dd'T'HH:mm";

	public record TimeRange(
			@NotNull @JsonFormat(pattern = DATE_TIME) LocalDateTime startTime,
			@NotNull @JsonFormat(pattern = DATE_TIME) LocalDateTime endTime) {

		@AssertTrue(message = "endTime must be after startTime")
		public boolean isRangeValid() {
			return startTime == null || endTime == null || endTime.isAfter(startTime);
		}
	}

	public record CreateRequest(
			@NotBlank @Size(max = 45) String projectNo,
			@Size(max = 45) String remark,
			@NotEmpty @Size(max = 31) List<@Valid @NotNull TimeRange> timeRange) {
	}

	public record UpdateRequest(
			@NotBlank @Size(max = 45) String projectNo,
			@Size(max = 45) String remark,
			@NotNull @JsonFormat(pattern = DATE_TIME) LocalDateTime startTime,
			@NotNull @JsonFormat(pattern = DATE_TIME) LocalDateTime endTime) {

		@AssertTrue(message = "endTime must be after startTime")
		public boolean isRangeValid() {
			return startTime == null || endTime == null || endTime.isAfter(startTime);
		}
	}

	public record Response(
			Long id,
			String projectNo,
			@JsonFormat(pattern = DATE_TIME) LocalDateTime startTime,
			@JsonFormat(pattern = DATE_TIME) LocalDateTime endTime,
			String remark,
			@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime lastUpdate) {

		static Response of(Overtime o) {
			return new Response(o.getId(), o.getProjectNo(), o.getStartTime(), o.getEndTime(), o.getRemark(),
					o.getLastUpdate());
		}
	}
}
