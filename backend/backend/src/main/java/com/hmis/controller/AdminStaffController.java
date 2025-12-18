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

import com.hmis.dto.staff.StaffCreateRequest;
import com.hmis.dto.staff.StaffResponse;
import com.hmis.dto.staff.StaffUpdateRequest;
import com.hmis.service.StaffService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/staff")
public class AdminStaffController {
	
	private final StaffService staffService;
	
	public AdminStaffController(StaffService staffService) {
		this.staffService = staffService;
	}
	
	@PostMapping
	public StaffResponse create(@Valid @RequestBody StaffCreateRequest req) {
		return staffService.create(req);
	}
	
	@GetMapping
	public List<StaffResponse> list(@RequestParam(required = false) Boolean onlyActive) {
		return staffService.list(onlyActive);
	}
	
	@PatchMapping("/{id}")
	public StaffResponse update(@PathVariable Long id, @Valid @RequestBody StaffUpdateRequest req) {
		return staffService.update(id,  req);
	}
	
	@PatchMapping("/{id}/deactivate")
	public void deactivate(@PathVariable Long id) {
		staffService.deactivate(id);
	}
	
	@PatchMapping("/{id}/activate")
	public void activate(@PathVariable Long id) {
		staffService.activate(id);
	}

}
