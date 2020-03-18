package com.cdgs.worktime.dto;

import java.io.Serializable;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class TimeListDto implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 3746452666023591026L;

	private Date startTime;
	private Date endTime;
}
