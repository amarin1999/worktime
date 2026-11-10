package com.cdgs.worktime.common;

import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.cdgs.worktime.isservice.IsServiceException;

/**
 * Converts exceptions into RFC 7807 problem responses. Internal details are logged, never returned.
 */
@RestControllerAdvice
public class ApiExceptionHandler {

	private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);

	@ExceptionHandler(NotFoundException.class)
	ProblemDetail notFound(NotFoundException e) {
		return problem(HttpStatus.NOT_FOUND, e.getMessage());
	}

	@ExceptionHandler(NoResourceFoundException.class)
	ProblemDetail noResource(NoResourceFoundException e) {
		return problem(HttpStatus.NOT_FOUND, "ไม่พบข้อมูล");
	}

	@ExceptionHandler(BadRequestException.class)
	ProblemDetail badRequest(BadRequestException e) {
		return problem(HttpStatus.BAD_REQUEST, e.getMessage());
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	ProblemDetail invalidBody(MethodArgumentNotValidException e) {
		String fields = e.getBindingResult().getFieldErrors().stream().map(f -> f.getField())
				.distinct().collect(Collectors.joining(", "));
		return problem(HttpStatus.BAD_REQUEST, "ข้อมูลไม่ถูกต้อง: " + fields);
	}

	@ExceptionHandler({ HandlerMethodValidationException.class, MethodArgumentTypeMismatchException.class,
			MissingServletRequestParameterException.class, HttpMessageNotReadableException.class,
			jakarta.validation.ConstraintViolationException.class })
	ProblemDetail invalidRequest(Exception e) {
		return problem(HttpStatus.BAD_REQUEST, "ข้อมูลไม่ถูกต้อง");
	}

	@ExceptionHandler(IsServiceException.class)
	ProblemDetail upstream(IsServiceException e) {
		log.warn("IS service call failed: {}", e.getMessage());
		return problem(HttpStatus.BAD_GATEWAY, "ไม่สามารถติดต่อระบบ IS ได้ กรุณาลองใหม่อีกครั้ง");
	}

	/** Let Spring Security's entry point / access denied handler produce 401/403. */
	@ExceptionHandler({ AccessDeniedException.class, AuthenticationException.class })
	void rethrowSecurity(RuntimeException e) {
		throw e;
	}

	@ExceptionHandler(Exception.class)
	ProblemDetail unexpected(Exception e) {
		log.error("Unhandled error", e);
		return problem(HttpStatus.INTERNAL_SERVER_ERROR, "เกิดข้อผิดพลาดในระบบ");
	}

	static ProblemDetail problem(HttpStatus status, String detail) {
		ProblemDetail pd = ProblemDetail.forStatusAndDetail(status, detail);
		pd.setTitle(status.getReasonPhrase());
		return pd;
	}
}
