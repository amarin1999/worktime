package com.cdgs.worktime.security;

import java.time.Clock;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.cdgs.worktime.config.SecurityProperties;

/**
 * Simple in-memory brute-force protection: after {@code maxLoginAttempts} failures a key (employee number or
 * client IP) is locked for {@code loginLockout}. Good enough for a single instance; use a shared store if the
 * API is ever scaled out.
 */
@Service
public class LoginAttemptService {

	private static final int MAX_TRACKED_KEYS = 10_000;

	private record Attempts(int failures, Instant firstFailure) {
	}

	private final Map<String, Attempts> attempts = new ConcurrentHashMap<>();
	private final SecurityProperties properties;
	private final Clock clock;

	public LoginAttemptService(SecurityProperties properties, Clock clock) {
		this.properties = properties;
		this.clock = clock;
	}

	public boolean isLocked(String key) {
		Attempts a = attempts.get(key);
		if (a == null) {
			return false;
		}
		if (expired(a)) {
			attempts.remove(key, a);
			return false;
		}
		return a.failures() >= properties.maxLoginAttempts();
	}

	public void failed(String key) {
		if (attempts.size() > MAX_TRACKED_KEYS) {
			attempts.values().removeIf(this::expired);
		}
		attempts.compute(key, (k, a) -> a == null || expired(a) ? new Attempts(1, clock.instant())
				: new Attempts(a.failures() + 1, a.firstFailure()));
	}

	public void succeeded(String key) {
		attempts.remove(key);
	}

	private boolean expired(Attempts a) {
		return a.firstFailure().plus(properties.loginLockout()).isBefore(clock.instant());
	}
}
