package com.hmis.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hmis.dto.staff.StaffResponse;
import com.hmis.service.StaffService;

@RestController
@RequestMapping("/api/staff")
public class StaffLookupController {
	
	private final StaffService service;
	
	public StaffLookupController(StaffService service) {
		this.service = service;
	}
	
	@GetMapping
	public List<StaffResponse> listActive() {
		return service.list(true);
	}

}
