package com.hmis.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hmis.dto.schedule.ScheduleCreateRequest;
import com.hmis.dto.schedule.ScheduleResponse;
import com.hmis.dto.schedule.ScheduleUpdateRequest;
import com.hmis.service.StaffScheduleService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/schedules")
public class AdminScheduleController {
	
	private final StaffScheduleService service;
	
	public AdminScheduleController(StaffScheduleService service) {
		this.service = service;
	}
	
	@PostMapping
	public ScheduleResponse create(@Valid @RequestBody ScheduleCreateRequest req) {
		return service.create(req);
	}
	
	@GetMapping
	public List<ScheduleResponse> list(@RequestParam(required = false) Boolean onlyActive) {
		return service.list(onlyActive);
	}
	
	@PatchMapping("/{id}")
	public ScheduleResponse update(
			@PathVariable Long id, 
			@Valid @RequestBody ScheduleUpdateRequest req) {
		return service.update(id, req);
	}
	
	@PatchMapping("/{id}/deactivate")
	public void deactivate(@PathVariable Long id) {
		service.deactivate(id);
	}
	
	@PatchMapping("/{id}/activate")
	public void activate(@PathVariable Long id) {
		service.activate(id);
	}

}
