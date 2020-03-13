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
import javax.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "employee_has_sidework_history")
@Embeddable
@Getter
@Setter
@ToString
public class EmployeeHasSideworkHistoryEntity implements Serializable {
	/**
	* 
	*/
	private static final long serialVersionUID = -3425483119931380227L;

	@Id
	@Column(name = "employee_has_sidework_history_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long employeeHasSideworkHistoryId;

	@Column(name = "employee_id")
	private Long idEmployee;

	@Column(name = "work_project_id")
	private Long idProject;

	@ManyToOne
	@JoinColumn(name = "employee_id", insertable = false, updatable = false)
	private EmployeeEntity employeeId;

	@Column(name = "work_type")
	private String workType;

	@ManyToOne
	@JoinColumn(name = "work_project_id", insertable = false, updatable = false)
	private WorkProjectEntity projectId;

}
