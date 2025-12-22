package com.hmis.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.hmis.dto.vitals.VitalsCreateRequest;
import com.hmis.dto.vitals.VitalsResponse;
import com.hmis.enums.VisitStatus;
import com.hmis.model.OpdVisit;
import com.hmis.model.PatientVitals;
import com.hmis.model.Staff;
import com.hmis.repository.OpdVisitRepository;
import com.hmis.repository.PatientVitalsRepository;
import com.hmis.repository.StaffRepository;

@Service
public class VitalsService {
	
	private final PatientVitalsRepository vitalsRepo;
	private final OpdVisitRepository opdVisitRepo;
	private final StaffRepository staffRepo;
	
	public VitalsService(
			PatientVitalsRepository vitalsRepo, 
			OpdVisitRepository opdVisitRepo, 
			StaffRepository staffRepo) 
	{
		this.vitalsRepo = vitalsRepo;
		this.opdVisitRepo = opdVisitRepo;
		this.staffRepo = staffRepo;
	}
	
	public VitalsResponse createVitals(Authentication auth, Long visitId, VitalsCreateRequest req) {
		Staff doctor = getCurrentDoctor(auth);
		
		OpdVisit visit = opdVisitRepo.findById(visitId)
				.orElseThrow(() -> new IllegalArgumentException("Visit not found"));
		
		if (!visit.isActive()) {
			throw new IllegalArgumentException("Visit not active");
		}
		
		if (visit.getDoctor() == null || !visit.getDoctor().getId().equals(doctor.getId())) {
            throw new SecurityException("Operation not allowed");
        }

        if (visit.getStatus() == VisitStatus.CANCELLED) {
            throw new IllegalStateException("Cannot add vitals for cancelled visit");
        }

        if (visit.getStatus() == VisitStatus.COMPLETED) {
            throw new IllegalStateException("Cannot add vitals for completed visit");
        }
        
        validateRequest(req);
        
        PatientVitals v = new PatientVitals();
        
        v.setOpdVisit(visit);
        v.setRecordedBy(doctor);
        v.setRecordedAt(Instant.now());
        
        v.setHeightCm(req.getHeightCm());
        v.setWeightKg(req.getWeightKg());
        v.setBpSystolic(req.getBpSystolic());
        v.setBpDiastolic(req.getBpDiastolic());
        v.setTemperatureC(req.getTemperatureC());
        v.setPulse(req.getPulse());
        v.setSpo2(req.getSpo2());

        return mapToResponse(vitalsRepo.save(v));
	}
	
	public List<VitalsResponse> getVitalsForVisit(Authentication auth, Long visitId) {
		Staff doctor = getCurrentDoctor(auth);
		
		OpdVisit visit = opdVisitRepo.findById(visitId)
				.orElseThrow(() -> new IllegalArgumentException("Visit not found"));
		
		if (!visit.isActive()) {
            throw new IllegalArgumentException("Visit not active");
        }

        if (visit.getDoctor() == null || !visit.getDoctor().getId().equals(doctor.getId())) {
            throw new SecurityException("Operation not allowed");
        }

        List<PatientVitals> list = vitalsRepo.findByOpdVisitIdOrderByRecordedAtDesc(visitId);

        List<VitalsResponse> out = new ArrayList<>();
        for (PatientVitals pv : list) out.add(mapToResponse(pv));
        return out;
	}
	
	private void validateRequest(VitalsCreateRequest req) {
		if (req == null) {
			throw new IllegalArgumentException("Request body required");
		}
		
		boolean hasAny =
                req.getHeightCm() != null ||
                req.getWeightKg() != null ||
                req.getBpSystolic() != null ||
                req.getBpDiastolic() != null ||
                req.getTemperatureC() != null ||
                req.getPulse() != null ||
                req.getSpo2() != null;

        if (!hasAny) {
            throw new IllegalArgumentException("At least one value must be provided");
        }

        // BP rule: both or none
        if ((req.getBpSystolic() == null) != (req.getBpDiastolic() == null)) {
            throw new IllegalArgumentException("Both systolic and diastolic are required for BP");
        }
		
	}
	
	private Staff getCurrentDoctor(Authentication auth) {
		return staffRepo.findByUsername(auth.getName())
				.orElseThrow(() -> new IllegalArgumentException("Doctor not found"));
	}
	
	private VitalsResponse mapToResponse(PatientVitals v) {
        VitalsResponse r = new VitalsResponse();
        r.setId(v.getId());
        r.setVisitId(v.getOpdVisit().getId());

        r.setRecordedAt(v.getRecordedAt());
        r.setRecordedByStaffId(v.getRecordedBy().getId());
        r.setRecordedByName(v.getRecordedBy().getFirstName() + " " + v.getRecordedBy().getLastName());

        r.setHeightCm(v.getHeightCm());
        r.setWeightKg(v.getWeightKg());
        r.setBpSystolic(v.getBpSystolic());
        r.setBpDiastolic(v.getBpDiastolic());
        r.setTemperatureC(v.getTemperatureC());
        r.setPulse(v.getPulse());
        r.setSpo2(v.getSpo2());

        return r;
    }
	
	

}
