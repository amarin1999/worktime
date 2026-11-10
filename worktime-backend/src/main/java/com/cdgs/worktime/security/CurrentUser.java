package com.cdgs.worktime.security;

/**
 * The authenticated employee, resolved from the session cookie. Use as
 * {@code @AuthenticationPrincipal CurrentUser user} in controllers.
 */
public record CurrentUser(long employeeId, String employeeNo, String firstname, String lastname, boolean admin) {
}
