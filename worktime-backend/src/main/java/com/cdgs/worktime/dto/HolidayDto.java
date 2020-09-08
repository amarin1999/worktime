package com.cdgs.worktime.dto;

public class HolidayDto {
private static final long serialVersionUID = 7900738635522301915L;
	
	private String holidayName;
	private String holidayDate;
	public HolidayDto(String holidayDate, String holidayName) {
    	this.holidayName = holidayName;
        this.holidayDate = holidayDate;
	}
	
	public String getHolidayName() {
		return holidayName;
	}
	public void setHolidayName(String holidayName) {
		this.holidayName = holidayName;
	}
	public String getHolidayDate() {
		return holidayDate;
	}
	public void setHolidayDate(String holidayDate) {
		this.holidayDate = holidayDate;
	}
}
