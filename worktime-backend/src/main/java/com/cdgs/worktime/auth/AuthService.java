package com.cdgs.worktime.auth;

import java.util.Locale;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.cdgs.worktime.config.SecurityProperties;
import com.cdgs.worktime.employee.Employee;
import com.cdgs.worktime.employee.EmployeeRepository;
import com.cdgs.worktime.isservice.IsServiceClient;
import com.cdgs.worktime.security.CurrentUser;
import com.cdgs.worktime.security.LoginAttemptService;
import com.cdgs.worktime.security.TokenService;

/**
 * Verifies the employee number and password against the CDG IS service and issues a session token.
 * The employee must also exist in this application's {@code employee} table.
 */
@Service
public class AuthService {

	private static final Logger log = LoggerFactory.getLogger(AuthService.class);
	private static final String INVALID = "รหัสพนักงานหรือรหัสผ่านไม่ถูกต้อง";

	public record LoginResult(String token, CurrentUser user) {
	}

	public static class LoginFailedException extends RuntimeException {
		private static final long serialVersionUID = 1L;
		private final HttpStatus status;

		LoginFailedException(HttpStatus status, String message) {
			super(message);
			this.status = status;
		}

		public HttpStatus status() {
			return status;
		}
	}

	private final IsServiceClient isService;
	private final EmployeeRepository employees;
	private final TokenService tokens;
	private final LoginAttemptService attempts;
	private final SecurityProperties properties;

	public AuthService(IsServiceClient isService, EmployeeRepository employees, TokenService tokens,
			LoginAttemptService attempts, SecurityProperties properties) {
		this.isService = isService;
		this.employees = employees;
		this.tokens = tokens;
		this.attempts = attempts;
		this.properties = properties;
	}

	public LoginResult login(String employeeNo, String password, String clientIp) {
		String userKey = "u:" + employeeNo.toUpperCase(Locale.ROOT);
		String ipKey = "ip:" + clientIp;
		if (attempts.isLocked(userKey) || attempts.isLocked(ipKey)) {
			throw new LoginFailedException(HttpStatus.TOO_MANY_REQUESTS,
					"เข้าสู่ระบบผิดหลายครั้ง กรุณารอสักครู่แล้วลองใหม่");
		}

		boolean valid;
		try {
			valid = isService.checkUserAuthentication(employeeNo, password);
		} catch (RuntimeException e) {
			log.warn("IS authentication unavailable: {}", e.getMessage());
			throw new LoginFailedException(HttpStatus.BAD_GATEWAY, "ไม่สามารถตรวจสอบรหัสผ่านได้ในขณะนี้");
		}

		Optional<Employee> employee = valid ? employees.findFirstByEmployeeNoIgnoreCase(employeeNo)
				: Optional.empty();
		if (employee.isEmpty()) {
			attempts.failed(userKey);
			attempts.failed(ipKey);
			log.info("Failed login for employee {} from {}", employeeNo.replaceAll("[^A-Za-z0-9_-]", "?"), clientIp);
			throw new LoginFailedException(HttpStatus.UNAUTHORIZED, INVALID);
		}

		attempts.succeeded(userKey);
		attempts.succeeded(ipKey);
		Employee e = employee.get();
		log.info("Employee {} logged in", e.getEmployeeNo());
		CurrentUser user = new CurrentUser(e.getId(), e.getEmployeeNo(), e.getFirstname(), e.getLastname(),
				properties.isAdmin(e.getEmployeeNo()));
		return new LoginResult(tokens.issue(e), user);
	}
}
