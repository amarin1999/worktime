package com.cdgs.worktime.dto;

import java.io.Serializable;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CalendarDto implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 2035968167410884038L;
	
	private Long id;
	private String title;
	private Date start;
	private Date end;
	private Date startTime;
	private Date endTime;
	private String remark;
	private Boolean workAnyWhere;
}
