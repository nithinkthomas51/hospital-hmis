package com.hmis.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hmis.dto.opdvisit.OpdVisitCreateRequest;
import com.hmis.dto.opdvisit.OpdVisitResponse;
import com.hmis.enums.VisitStatus;
import com.hmis.model.Department;
import com.hmis.model.OpdVisit;
import com.hmis.model.Patient;
import com.hmis.model.Staff;
import com.hmis.repository.DepartmentRepository;
import com.hmis.repository.OpdVisitRepository;
import com.hmis.repository.PatientRepository;
import com.hmis.repository.StaffRepository;

import jakarta.transaction.Transactional;

@Service
public class OpdVisitService {
	
	private final OpdVisitRepository opdVisitRepo;
	private final PatientRepository patientRepo;
	private final DepartmentRepository deptRepo;
	private final StaffRepository staffRepo;
	
	public OpdVisitService(
			OpdVisitRepository opdVisitRepo, 
			PatientRepository patientRepo,
			DepartmentRepository deptRepo, 
			StaffRepository staffRepo) {
		this.opdVisitRepo = opdVisitRepo;
		this.patientRepo = patientRepo;
		this.deptRepo = deptRepo;
		this.staffRepo = staffRepo;
	}
	
	@Transactional
	public OpdVisitResponse checkIn(OpdVisitCreateRequest req) {
		Patient patient = patientRepo.findByOpNumberIgnoreCase(req.getPatientOpNumber())
				.orElseThrow(() -> new IllegalArgumentException("Patient not founnd"));
		
		if (!patient.isActive()) {
			throw new IllegalArgumentException("Patient is inactive");
		}
		
		Department dept = deptRepo.findById(req.getDepartmentId())
				.orElseThrow(() -> new IllegalArgumentException("Department not found"));
		
		if (!dept.isActive()) {
			throw new IllegalArgumentException("Department is inactive");
		}
		
		Staff doctor = staffRepo.findById(req.getDoctorId())
				.orElseThrow(() -> new IllegalArgumentException("Doctor not found"));
		
		if (!doctor.isActive()) {
			throw new IllegalArgumentException("Doctor is inactive");
		}
		
		if (doctor.getDepartment() == null || !doctor.getDepartment().getId().equals(dept.getId())) {
			throw new IllegalArgumentException("Doctor does not belong to selected department");
		}
		
		OpdVisit v = new OpdVisit();
		v.setPatient(patient);
		v.setDepartment(dept);
		v.setDoctor(doctor);
		v.setStatus(VisitStatus.CHECKED_IN);
		v.setCheckInAt(Instant.now());
		v.setCompletedAt(null);
		v.setActive(true);
		
		return mapToResponse(opdVisitRepo.save(v));
	}
	
	public List<OpdVisitResponse> receptionistQueue(String date, String status, Long doctorId, Long departmentId) {
		Instant[] range = dayRange(date);
		
		VisitStatus st = null;
		if (status != null && !status.trim().isEmpty()) {
			st = VisitStatus.valueOf(status.trim());
		} else {
			st = VisitStatus.CHECKED_IN;
		}
		
		List<OpdVisit> list = opdVisitRepo.findQueue(st, doctorId, departmentId, range[0], range[1]);
		List<OpdVisitResponse> out = new ArrayList<>();
		for (OpdVisit v : list) out.add(mapToResponse(v));
		
		return out;
	}
	
	public List<OpdVisitResponse> doctorQueue(Long doctorStaffId, String date) {
		Instant[] range = dayRange(date);
		List<OpdVisit> list = opdVisitRepo.findDoctorQueue(doctorStaffId, range[0], range[1]);
		List<OpdVisitResponse> out = new ArrayList<>();
		for (OpdVisit v : list) out.add(mapToResponse(v));
		return out;
	}
	
	@Transactional
	public void cancel(Long id) {
		OpdVisit v = opdVisitRepo.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Visit not found"));
		
		if (v.getStatus() == VisitStatus.COMPLETED) {
			throw new IllegalStateException("Completed visit cannot be cancelled");
		}
		
		v.setStatus(VisitStatus.CANCELLED);
	}
	
	@Transactional
	public void complete(Long visitId, Long doctorId) {
		
		OpdVisit v = opdVisitRepo.findById(visitId)
				.orElseThrow(() -> new IllegalArgumentException("Visit not found"));
		
		if (v.getStatus() == VisitStatus.CANCELLED) {
			throw new IllegalStateException("Cancelled visit cannot be completed");
		}
		
		if (v.getStatus() == VisitStatus.COMPLETED) {
			throw new IllegalStateException("Visit already completed");
		}
		
		if (!v.getDoctor().getId().equals(doctorId)) {
			throw new SecurityException("Doctor cannot complete another Doctor's visit");
		}
		
		v.setStatus(VisitStatus.COMPLETED);
		v.setCompletedAt(Instant.now());
		
	}
	
	private Instant[] dayRange(String date) {
		ZoneId zone = ZoneId.of("Europe/Dublin");
		
		LocalDate d;
		if (date == null || date.trim().isEmpty()) {
			d = LocalDate.now(zone);
		} else {
			try {
				d = LocalDate.parse(date.trim());
			} catch (DateTimeParseException e) {
				throw new IllegalArgumentException("Invalid date format. use YYYY-MM-DD");
			}
		}
		
		Instant from = d.atStartOfDay(zone).toInstant();
		Instant to = d.plusDays(1).atStartOfDay(zone).toInstant();
		return new Instant[] {from, to};
	}
	
	
	
	private OpdVisitResponse mapToResponse(OpdVisit v) {
		OpdVisitResponse r = new OpdVisitResponse();
		r.setId(v.getId());
		r.setActive(v.isActive());
		r.setStatus(v.getStatus().name());
		r.setCheckInAt(v.getCheckInAt());
		r.setCompletedAt(v.getCompletedAt());
		
		r.setPatientId(v.getPatient().getId());
		r.setPatientOpNumber(v.getPatient().getOpNumber());
		r.setPatientName(v.getPatient().getFirstName() + " " + v.getPatient().getLastName());
		r.setPatientDob(v.getPatient().getDob());
		r.setPatientGender(v.getPatient().getGender().name());
		r.setPatientPhone(v.getPatient().getPhone());
		
		r.setDoctorStaffId(v.getDoctor().getId());
		r.setDoctorName(v.getDoctor().getFirstName() + " " + v.getDoctor().getLastName());
		r.setDoctorUsername(v.getDoctor().getUser().getUserName());
		
		r.setDepartmentId(v.getDepartment().getId());
		r.setDepartmentName(v.getDepartment().getName());
		
		return r;
	}
	
	

}
