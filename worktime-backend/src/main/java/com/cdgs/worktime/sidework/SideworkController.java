package com.cdgs.worktime.sidework;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cdgs.worktime.security.CurrentUser;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/sidework")
public class SideworkController {

	private final SideworkService service;

	public SideworkController(SideworkService service) {
		this.service = service;
	}

	@GetMapping
	public List<SideworkResponse> list(@AuthenticationPrincipal CurrentUser user) {
		return service.list(user.employeeId());
	}

	@GetMapping("/by-date")
	public SideworkResponse byDate(@AuthenticationPrincipal CurrentUser user,
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
		return service.getByDate(user.employeeId(), date);
	}

	@GetMapping("/{id}")
	public SideworkResponse get(@AuthenticationPrincipal CurrentUser user, @PathVariable long id) {
		return service.get(user.employeeId(), id);
	}

	@PostMapping
	public SideworkResponse save(@AuthenticationPrincipal CurrentUser user,
			@Valid @RequestBody SideworkRequest request) {
		return service.save(user.employeeId(), request);
	}

	@PutMapping("/{id}")
	public SideworkResponse update(@AuthenticationPrincipal CurrentUser user, @PathVariable long id,
			@Valid @RequestBody SideworkRequest request) {
		return service.update(user.employeeId(), id, request);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@AuthenticationPrincipal CurrentUser user, @PathVariable long id) {
		service.delete(user.employeeId(), id);
		return ResponseEntity.noContent().build();
	}
}
