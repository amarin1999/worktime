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
@Table(name = "worktype")
@Embeddable
@Getter
@Setter
@ToString
public class WorktypeEntity implements Serializable {/**
	 * 
	 */
	private static final long serialVersionUID = -7367883789362944126L;
	
	@Id
	@Column(name = "id_work_type")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long worktypeId;
	
	public Long getWorktypeId() {
		return worktypeId;
	}

	public void setWorktypeId(Long worktypeId) {
		this.worktypeId = worktypeId;
	}

	public String getWorktypeName() {
		return worktypeName;
	}

	public void setWorktypeName(String worktypeName) {
		this.worktypeName = worktypeName;
	}

	@Column(name = "work_type_name")
	private String worktypeName;

}
