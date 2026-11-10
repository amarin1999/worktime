package com.cdgs.worktime.common;

/**
 * Thrown when a record does not exist or does not belong to the current user.
 * Both cases map to 404 so callers cannot probe other users' record ids.
 */
public class NotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public NotFoundException() {
		super("ไม่พบข้อมูล");
	}
}
