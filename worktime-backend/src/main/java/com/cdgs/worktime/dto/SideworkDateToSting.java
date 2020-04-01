package com.cdgs.worktime.dto;

import java.io.Serializable;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class SideworkDateToSting implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -765739394950691690L;
	
	private Long id;
	private Long employeehasId;
	private String startTime;
	private String endTime;
	private String date;
	private String remark;
	private Boolean workAnyWhere;

}
