package com.cdgs.worktime.dto;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

public class OtPostTimeDto implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -5060788856760595411L;

	private Long id;
	private Long employeehasId;
	private List<Date> date;
	private String remark;
	private Date lastUpdate;
	private String projectNo;
	private String employeeNo;
}
