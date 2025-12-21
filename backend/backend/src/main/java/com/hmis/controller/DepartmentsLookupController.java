package com.hmis.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hmis.dto.department.DepartmentResponse;
import com.hmis.service.DepartmentService;

@RestController
@RequestMapping("/api/departments")
public class DepartmentsLookupController {
	
	private final DepartmentService service;
	
	public DepartmentsLookupController(DepartmentService service) {
		this.service = service;
	}
	
	@GetMapping
	public List<DepartmentResponse> listActive() {
		return service.list(true);
	}

}
