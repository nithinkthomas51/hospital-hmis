package com.hmis.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hmis.dto.vitals.VitalsCreateRequest;
import com.hmis.dto.vitals.VitalsResponse;
import com.hmis.service.VitalsService;

@RestController
@RequestMapping("/api/clinical/visits")
public class ClinicalVitalsController {
	
	private final VitalsService service;
	
	public ClinicalVitalsController(VitalsService service) {
		this.service = service;
	}
	
	@PostMapping("/{visitId}/vitals")
	public VitalsResponse createVitals(
			@PathVariable Long visitId, 
			@RequestBody VitalsCreateRequest req, 
			Authentication auth) 
	{
		return service.createVitals(auth, visitId, req);
	}
	
	@GetMapping("/{visitId}/vitals")
	public List<VitalsResponse> getVitals(
			@PathVariable Long visitId, 
			Authentication auth) 
	{
		return service.getVitalsForVisit(auth, visitId);
	}

}
