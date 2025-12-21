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
import com.hmis.model.Staff;
import com.hmis.repository.StaffRepository;
import com.hmis.service.OpdVisitService;

@RestController
@RequestMapping("/api/doctor/visits")
public class DoctorVisitController {
	
	private final OpdVisitService service;
	private final StaffRepository repo;
	
	public DoctorVisitController(OpdVisitService service, StaffRepository repo) {
		this.service = service;
		this.repo = repo;
	}
	
	@GetMapping
	public List<OpdVisitResponse> myQueue(
			@RequestParam(required = false) String date, 
			Authentication auth) 
	{
		String username = auth.getName();
		Staff doctor = repo.findByUsername(username)
				.orElseThrow(() -> new IllegalArgumentException("Staff profile not found"));
		return service.doctorQueue(doctor.getId(), date);
	}
	
	@PatchMapping("/{id}/complete")
	public void complete(@PathVariable Long id, Authentication auth) {
		String username = auth.getName();
		Staff doctor = repo.findByUsername(username)
				.orElseThrow(() -> new IllegalArgumentException("Staff profile not found"));
		service.complete(id, doctor.getId());
	}

}
