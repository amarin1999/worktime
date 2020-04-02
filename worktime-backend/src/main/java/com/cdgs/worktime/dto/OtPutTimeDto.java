package com.cdgs.worktime.dto;

import java.io.Serializable;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class OtPutTimeDto implements Serializable {
	

	/**
	 * 
	 */
	private static final long serialVersionUID = -4692275615269266522L;
	
	private Long id;
	private Date startTime;
	private Date endTime;
	private String remark;
	private String projectNo;
}
