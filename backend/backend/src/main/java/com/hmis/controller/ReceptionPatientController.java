package com.hmis.controller;

import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hmis.dto.patient.PatientCreateRequest;
import com.hmis.dto.patient.PatientResponse;
import com.hmis.dto.patient.PatientUpdateRequest;
import com.hmis.service.PatientService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reception/patients")
public class ReceptionPatientController {
	
	private final PatientService service;
	
	public ReceptionPatientController(PatientService service) {
		this.service = service;
	}
	
	@PostMapping
	public PatientResponse create(@Valid @RequestBody PatientCreateRequest req) {
		return service.create(req);
	}
	
	@PatchMapping("/{id}")
	public PatientResponse update(@PathVariable Long id, @Valid @RequestBody PatientUpdateRequest req) {
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
