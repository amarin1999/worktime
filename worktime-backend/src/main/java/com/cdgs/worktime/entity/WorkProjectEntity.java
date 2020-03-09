package com.cdgs.worktime.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="work_project")
@Embeddable
@Getter
@Setter
@ToString
public class WorkProjectEntity implements Serializable {/**
	 * 
	 */
	private static final long serialVersionUID = -5716995905425245603L;
	
	@Id
	@Column(name = "id_work_project")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long projectId;
	
	@Column(name="project_no")
	private String projectNo;

}
