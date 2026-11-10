package com.cdgs.worktime.isservice;

public class IsServiceException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public IsServiceException(String message, Throwable cause) {
		super(message, cause);
	}

	public IsServiceException(String message) {
		super(message);
	}
}
