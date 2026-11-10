package com.cdgs.worktime.config;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;
import java.util.Set;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

/**
 * Security settings bound from {@code app.security.*}.
 */
@ConfigurationProperties("app.security")
public record SecurityProperties(
		String jwtSecret,
		@DefaultValue("8h") Duration sessionDuration,
		@DefaultValue("true") boolean secureCookie,
		@DefaultValue Set<String> adminEmployeeNos,
		@DefaultValue List<String> allowedOrigins,
		@DefaultValue("5") int maxLoginAttempts,
		@DefaultValue("15m") Duration loginLockout) {

	public SecurityProperties {
		if (jwtSecret == null || jwtSecret.getBytes(StandardCharsets.UTF_8).length < 32) {
			throw new IllegalStateException("app.security.jwt-secret (JWT_SECRET) must be set to at least 32 bytes");
		}
		adminEmployeeNos = adminEmployeeNos.stream().map(String::trim).filter(s -> !s.isEmpty())
				.map(String::toUpperCase).collect(java.util.stream.Collectors.toUnmodifiableSet());
		allowedOrigins = allowedOrigins.stream().map(String::trim).filter(s -> !s.isEmpty()).toList();
	}

	public boolean isAdmin(String employeeNo) {
		return employeeNo != null && adminEmployeeNos.contains(employeeNo.toUpperCase());
	}
}
