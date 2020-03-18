package com.cdgs.worktime.dto;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class WorkTypeDto implements Serializable {/**
	 * 
	 */
	private static final long serialVersionUID = 2439931170146811951L;

	private Long id;
	private String name;
}
