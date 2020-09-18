package com.cdgs.worktime.dto;

import java.io.Serializable;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HolidayDto implements Serializable {
private static final long serialVersionUID = 7900738635522301915L;
	
	private String title;
	private Date start;
	
}
