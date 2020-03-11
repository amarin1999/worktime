package com.cdgs.worktime.entity;

import java.io.Serializable;
import java.util.Date;

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

	@Column(name = "start_time")
	private Date startTime;

	@Column(name = "end_time")
	private Date endTime;

	@Column(name = "work_comment")
	private String workComment;

	@Column(name = "last_update_time")
	private String lastUpdate;
}