package com.cdgs.worktime.dto;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class EmployeeDayDto implements Serializable{

	private static final long serialVersionUID = 4117251794789698554L;
	
	@Id
	private String employeeNo;
	private String firstname;
	private String lastname;
	private Long workAnywhere;
}
