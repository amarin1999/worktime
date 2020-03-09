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
public class EmployeeDto implements Serializable {
	
	private static final long serialVersionUID = 4117251794789698554L;
	
	private Long id ;
	private String no;
	private String firstname;
	private String lastname;


}
