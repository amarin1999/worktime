package com.cdgs.worktime.common;

/**
 * A business rule violation whose message is safe to show to the user (Thai).
 */
public class BadRequestException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public BadRequestException(String userMessage) {
		super(userMessage);
	}
}
