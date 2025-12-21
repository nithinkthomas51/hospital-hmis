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

import com.hmis.dto.opdvisit.OpdVisitCreateRequest;
import com.hmis.dto.opdvisit.OpdVisitResponse;
import com.hmis.service.OpdVisitService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reception/visits")
public class ReceptionVisitController {
	
	private final OpdVisitService service;
	
	public ReceptionVisitController(OpdVisitService service) {
		this.service = service;
	}
	
	@PostMapping
	public OpdVisitResponse checkIn(@Valid @RequestBody OpdVisitCreateRequest req) {
		return service.checkIn(req);
	}
	
	@GetMapping
	public List<OpdVisitResponse> queue(
			@RequestParam(required = false) String date, 
			@RequestParam(required = false) String status, 
			@RequestParam(required = false) Long doctorId,
			@RequestParam(required = false) Long deptId
	) {
		return service.receptionistQueue(date, status, doctorId, deptId);
	}
	
	@PatchMapping
	public void cancel(@PathVariable Long id) {
		service.cancel(id);
	}

}
