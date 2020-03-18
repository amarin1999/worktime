package com.cdgs.worktime.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class OtPostTimeDto implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -5060788856760595411L;

	private Long id;
	private Long employeehasId;
	private List<TimeListDto> timeRange;
	private String remark;
	private Date lastUpdate;
	private String projectNo;
	private String employeeNo;
}
