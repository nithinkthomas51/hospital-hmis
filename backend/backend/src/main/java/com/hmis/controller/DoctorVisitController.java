package com.hmis.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hmis.dto.opdvisit.OpdVisitResponse;
import com.hmis.service.OpdVisitService;

@RestController
@RequestMapping("/api/doctor/visits")
public class DoctorVisitController {
	
	private final OpdVisitService service;
	
	public DoctorVisitController(OpdVisitService service) {
		this.service = service;
	}
	
	@GetMapping
	public List<OpdVisitResponse> myVisits(
			@RequestParam(required = false) String date,
			@RequestParam(required = false) String status,
			Authentication auth) 
	{
		return service.doctorVisits(auth, date, status);
	}
	
	@GetMapping("/{id}")
	public OpdVisitResponse getVisitDetails(@PathVariable Long id, Authentication auth) {
		return service.getVisitDetails(auth, id);
	}
	
	@PatchMapping("/{id}/complete")
	public void complete(@PathVariable Long id, Authentication auth) {
		service.complete(id, auth);
	}

}
