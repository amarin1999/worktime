package com.cdgs.worktime.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "employee_has_sidework_history")
@Embeddable
@Getter
@Setter
@ToString
public class EmployeeHasSideworkHistoryEntity implements Serializable {/**
	 * 
	 */
	private static final long serialVersionUID = -3425483119931380227L;

	@Id
	@ManyToOne
	@JoinColumn(name = "id_employee")
	private EmployeeEntity employeeId;
	
	@Id
	@ManyToOne
	@JoinColumn(name="id_sidework_history")
	private SideworkHistoryEntity sideworkHistoryId;
	
	@Column(name="work_type")
	private String workType;
	
	@ManyToOne
	@JoinColumn(name="id_work_project")
	private WorkProjectEntity projectId;
	

}
