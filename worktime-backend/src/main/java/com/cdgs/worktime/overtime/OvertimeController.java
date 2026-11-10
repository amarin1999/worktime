package com.cdgs.worktime.overtime;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdgs.worktime.overtime.OvertimeDtos.CreateRequest;
import com.cdgs.worktime.overtime.OvertimeDtos.Response;
import com.cdgs.worktime.overtime.OvertimeDtos.UpdateRequest;
import com.cdgs.worktime.security.CurrentUser;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/overtime")
public class OvertimeController {

	private final OvertimeService service;

	public OvertimeController(OvertimeService service) {
		this.service = service;
	}

	@GetMapping
	public List<Response> list(@AuthenticationPrincipal CurrentUser user) {
		return service.list(user.employeeId());
	}

	@GetMapping("/{id}")
	public Response get(@AuthenticationPrincipal CurrentUser user, @PathVariable long id) {
		return service.get(user.employeeId(), id);
	}

	@PostMapping
	public List<Response> create(@AuthenticationPrincipal CurrentUser user,
			@Valid @RequestBody CreateRequest request) {
		return service.create(user.employeeId(), request);
	}

	@PutMapping("/{id}")
	public Response update(@AuthenticationPrincipal CurrentUser user, @PathVariable long id,
			@Valid @RequestBody UpdateRequest request) {
		return service.update(user.employeeId(), id, request);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@AuthenticationPrincipal CurrentUser user, @PathVariable long id) {
		service.delete(user.employeeId(), id);
		return ResponseEntity.noContent().build();
	}
}
