package com.cdgs.worktime.dto;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class OtHistoryDto implements Serializable {/**
	 * 
	 */
	private static final long serialVersionUID = 253647904391479675L;

	private Long id;
	private Long employeehasId;
	private List<TimeListDto> date;
	private String remark;
	private Date lastUpdate;
	private String projectNo;

}
