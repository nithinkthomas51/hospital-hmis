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

import com.hmis.dto.department.DepartmentCreateRequest;
import com.hmis.dto.department.DepartmentResponse;
import com.hmis.dto.department.DepartmentUpdateRequest;
import com.hmis.service.DepartmentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/departments")
public class AdminDepartmentController {
	
	private final DepartmentService departmentService;
	
	public AdminDepartmentController(DepartmentService departmentService) {
		this.departmentService = departmentService;
	}
	
	@PostMapping
	public DepartmentResponse create(@Valid @RequestBody DepartmentCreateRequest req) {
		return departmentService.create(req);
	}
	
	@GetMapping
	public List<DepartmentResponse> list(@RequestParam(defaultValue = "true")boolean onlyActive) {
		return departmentService.list(onlyActive);
	}
	
	@PatchMapping("/{id}")
	public DepartmentResponse update(@PathVariable Long id, @Valid @RequestBody DepartmentUpdateRequest req) {
		return departmentService.update(id,  req);
	}
	
	@PatchMapping("/{id}/deactivate")
	public void deactivate(@PathVariable Long id) {
		departmentService.deactivate(id);
	}

}
