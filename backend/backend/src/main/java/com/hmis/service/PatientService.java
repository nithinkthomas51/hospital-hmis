package com.hmis.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hmis.dto.patient.PatientCreateRequest;
import com.hmis.dto.patient.PatientResponse;
import com.hmis.dto.patient.PatientUpdateRequest;
import com.hmis.model.Patient;
import com.hmis.repository.PatientRepository;

import jakarta.transaction.Transactional;

@Service
public class PatientService {
	
	private final PatientRepository patientRepo;
	private final OpNumberService opNumberService;
	
	public PatientService(PatientRepository patientRepo, OpNumberService opNumberService) {
		this.patientRepo = patientRepo;
		this.opNumberService = opNumberService;
	}
	
	@Transactional
	public PatientResponse create(PatientCreateRequest req) {
		
		if (req.getDob().isAfter(LocalDate.now())) {
			throw new IllegalArgumentException("DOB cannot be in the future");
		}
		
		Patient p = new Patient();
		p.setOpNumber(opNumberService.nextOpNumber());
		p.setFirstName(req.getFirstName().trim());
		p.setLastName(req.getLastName().trim());
		p.setDob(req.getDob());
		p.setGender(req.getGender());
		p.setPhone(trimOrNull(req.getPhone()));
		p.setEmail(trimOrNull(req.getEmail()));
		p.setAddress(trimOrNull(req.getAddress()));
		p.setEmergencyContactName(trimOrNull(req.getEmergencyContactName()));
		p.setEmergencyContactPhone(trimOrNull(req.getEmergencyContactPhone()));
		p.setActive(true);
		
		return mapToResponse(patientRepo.save(p));
		
	}
	
	public List<PatientResponse> search(String query, Boolean onlyActive) {
		String q = (query == null) ? "" : query.trim();
		List<Patient> list;
		
		if (q.isEmpty()) {
			boolean active = (onlyActive == null) ? true : onlyActive.booleanValue();
			list = patientRepo.findAllByActive(active);
		} else {
			list = patientRepo.search(q, onlyActive);
		}
		
		List<PatientResponse> out = new ArrayList<>();
		for (Patient p : list) {
			out.add(mapToResponse(p));
		}
		return out;
	}
	
	public PatientResponse getByOpNumber(String opNumber) {
		Patient p = patientRepo.findByOpNumberIgnoreCase(opNumber)
				.orElseThrow(() -> new IllegalArgumentException("Patient not found"));
		return mapToResponse(p);
	}
	
	@Transactional
	public PatientResponse update(Long id, PatientUpdateRequest req) {
		Patient p = patientRepo.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Patient not found"));
		
		if (req.getDob().isAfter(LocalDate.now())) {
			throw new IllegalArgumentException("DOB cannot be in the future");
		}
		
		p.setFirstName(req.getFirstName().trim());
		p.setLastName(req.getLastName().trim());
		p.setDob(req.getDob());
		p.setGender(req.getGender());
		p.setPhone(trimOrNull(req.getPhone()));
		p.setEmail(trimOrNull(req.getEmail()));
		p.setAddress(trimOrNull(req.getAddress()));
		p.setEmergencyContactName(trimOrNull(req.getEmergencyContactName()));
		p.setEmergencyContactPhone(trimOrNull(req.getEmergencyContactPhone()));
		
		return mapToResponse(patientRepo.save(p));
	}
	
	@Transactional
	public void deactivate(Long id) {
		Patient p = patientRepo.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Patient not found"));
		p.setActive(false);
	}
	
	@Transactional
	public void activate(Long id) {
		Patient p = patientRepo.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Patient not found"));
		p.setActive(true);
	}
	
	private String trimOrNull(String s) {
		if (s == null) return null;
		String t = s.trim();
		return t.isEmpty() ? null : t;
	}
	
	private PatientResponse mapToResponse(Patient p) {
		PatientResponse r = new PatientResponse();
		
		r.setId(p.getId());
		r.setOpNumber(p.getOpNumber());
		r.setFirstName(p.getFirstName());
		r.setLastName(p.getLastName());
		r.setDob(p.getDob());
		r.setGender(p.getGender().name());
		r.setPhone(p.getPhone());
		r.setEmail(p.getEmail());
		r.setAddress(p.getAddress());
		r.setEmergencyContactName(p.getEmergencyContactName());
		r.setEmergencyContactPhone(p.getEmergencyContactPhone());
		r.setActive(p.isActive());
		r.setCreatedAt(p.getCreatedAt());
		r.setUpdatedAt(p.getUpdatedAt());
		
		return r;
	}

}
