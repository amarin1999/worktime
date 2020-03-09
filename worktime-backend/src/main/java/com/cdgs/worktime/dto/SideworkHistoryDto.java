package com.cdgs.worktime.dto;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class SideworkHistoryDto {

	private Long id;
	private Date startTime;
	private Date endTime;
	private String workComment;
	private Date lastUpdate;
}
