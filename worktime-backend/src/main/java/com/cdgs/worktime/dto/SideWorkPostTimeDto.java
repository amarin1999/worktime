package com.cdgs.worktime.dto;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class SideWorkPostTimeDto {

	private Date startTime;
	private Date endTime;
	private Boolean workAnyWhere;
	private String remark;
	private String employeeNo;
}
