package com.cdgs.worktime.dto;

import java.io.Serializable;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class OtNoListDto implements Serializable {/**
	 * 
	 */
	private static final long serialVersionUID = 7900738635522301915L;

	private Long id;
	private Long employeehasId;
	private String startTime;
	private String endTime;
	private String remark;
	private Date lastUpdate;
	private String idProject;
}
