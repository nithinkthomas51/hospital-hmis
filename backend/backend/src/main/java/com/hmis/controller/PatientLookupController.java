package com.hmis.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hmis.dto.patient.PatientResponse;
import com.hmis.service.PatientService;

@RestController
@RequestMapping("/api/patients")
public class PatientLookupController {
	
	private final PatientService service;
	
	public PatientLookupController(PatientService service) {
		this.service = service;
	}
	
	@GetMapping("/search")
	public List<PatientResponse> search(
			@RequestParam(required = false) String query, 
			@RequestParam(required = false) Boolean onlyActive) {
		return service.search(query, onlyActive);
	}
	
	@GetMapping("/{opNumber}")
	public PatientResponse getByOpNumber(@PathVariable String opNumber) {
		return service.getByOpNumber(opNumber);
	}

}
