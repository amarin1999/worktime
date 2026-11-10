package com.cdgs.worktime.auth;

import java.time.Duration;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdgs.worktime.config.SecurityProperties;
import com.cdgs.worktime.security.CurrentUser;
import com.cdgs.worktime.security.SessionCookieFilter;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	public record LoginRequest(@NotBlank @Size(max = 20) String employeeNo, @NotBlank @Size(max = 128) String password) {
	}

	public record UserResponse(String employeeNo, String firstname, String lastname, boolean admin) {
		static UserResponse of(CurrentUser u) {
			return new UserResponse(u.employeeNo(), u.firstname(), u.lastname(), u.admin());
		}
	}

	private final AuthService authService;
	private final SecurityProperties properties;

	public AuthController(AuthService authService, SecurityProperties properties) {
		this.authService = authService;
		this.properties = properties;
	}

	/** Makes Spring Security write the XSRF-TOKEN cookie so the SPA can send it with the login request. */
	@GetMapping("/csrf")
	public ResponseEntity<Void> csrf(CsrfToken token) {
		token.getToken();
		return ResponseEntity.noContent().build();
	}

	@PostMapping("/login")
	public ResponseEntity<UserResponse> login(@Valid @RequestBody LoginRequest body, HttpServletRequest request) {
		AuthService.LoginResult result = authService.login(body.employeeNo().trim(), body.password(),
				request.getRemoteAddr());
		return ResponseEntity.ok()
				.header(HttpHeaders.SET_COOKIE,
						sessionCookie(request, result.token(), properties.sessionDuration()).toString())
				.body(UserResponse.of(result.user()));
	}

	@PostMapping("/logout")
	public ResponseEntity<Void> logout(HttpServletRequest request) {
		return ResponseEntity.noContent()
				.header(HttpHeaders.SET_COOKIE, sessionCookie(request, "", Duration.ZERO).toString()).build();
	}

	@GetMapping("/me")
	public UserResponse me(@AuthenticationPrincipal CurrentUser user) {
		return UserResponse.of(user);
	}

	@ExceptionHandler(AuthService.LoginFailedException.class)
	ResponseEntity<ProblemDetail> loginFailed(AuthService.LoginFailedException e) {
		ProblemDetail pd = ProblemDetail.forStatusAndDetail(e.status(), e.getMessage());
		pd.setTitle(e.status().getReasonPhrase());
		return ResponseEntity.status(e.status()).body(pd);
	}

	private ResponseCookie sessionCookie(HttpServletRequest request, String value, Duration maxAge) {
		String path = request.getContextPath().isEmpty() ? "/" : request.getContextPath();
		return ResponseCookie.from(SessionCookieFilter.COOKIE_NAME, value).httpOnly(true)
				.secure(properties.secureCookie()).sameSite("Strict").path(path).maxAge(maxAge).build();
	}
}
