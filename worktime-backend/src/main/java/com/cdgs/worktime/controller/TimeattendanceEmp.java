package com.cdgs.worktime.controller;

public class TimeattendanceEmp implements Comparable<TimeattendanceEmp> {
	
	private String id;
    private String day;
    private String time;
    
    public TimeattendanceEmp(String id, String day, String time) {
    	this.id = id;
        this.day = day;
        this.time = time;
	}
    
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getDay() {
		return day;
	}
	public void setDay(String day) {
		this.day = day;
	}
	public String getTime() {
		return time;
	}
	public void setTime(String time) {
		this.time = time;
	}
	
	@Override
	public int compareTo(TimeattendanceEmp o) {
		return getTime().compareTo(o.getTime());	
	}
	
	@Override
    public String toString() {
        return "[ id=" + id + ", day=" + day + ", time=" + time + "]";
    }
	
	

	

}
