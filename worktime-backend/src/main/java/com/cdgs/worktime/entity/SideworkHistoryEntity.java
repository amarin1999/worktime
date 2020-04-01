package com.cdgs.worktime.entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "sidework_history")
@Embeddable
@Getter
@Setter
@ToString
public class SideworkHistoryEntity implements Serializable {
	/**
	* 
	*/
	private static final long serialVersionUID = -3425483119931380227L;

	@Id
	@Column(name = "id_sidework_history")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long sideworkId;

	@Column(name = "employee_has_sidework_history_id")
	private Long idEmployeeHasSideWorkHistory;

	@ManyToOne
	@JoinColumn(name = "employee_has_sidework_history_id", insertable = false, updatable = false)
	private EmployeeHasSideworkHistoryEntity employeeHasSideworkHistoryId;

	@Column(name = "start_time")
	@Temporal(TemporalType.TIMESTAMP)
	private Date startTime;

	@Column(name = "end_time")
	@Temporal(TemporalType.TIMESTAMP)
	private Date endTime;

	@Column(name = "work_comment")
	private String remark;

	@Column(name = "work_anywhere")
	private Boolean workAnyWhere;

	@Column(name = "last_update_time")
	@Temporal(TemporalType.TIMESTAMP)
	private Date lastUpdate;
	
	@Column(name = "day")
	@Temporal(TemporalType.TIMESTAMP)
	private Date date;

}
