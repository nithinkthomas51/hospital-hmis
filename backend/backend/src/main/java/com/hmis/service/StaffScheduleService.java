package com.hmis.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hmis.dto.schedule.ScheduleCreateRequest;
import com.hmis.dto.schedule.ScheduleResponse;
import com.hmis.dto.schedule.ScheduleUpdateRequest;
import com.hmis.model.Department;
import com.hmis.model.Staff;
import com.hmis.model.StaffSchedule;
import com.hmis.model.UserRoles;
import com.hmis.repository.StaffRepository;
import com.hmis.repository.StaffScheduleRepository;

import jakarta.transaction.Transactional;

@Service
public class StaffScheduleService {
	
	private final StaffScheduleRepository staffScheduleRepo;
	private final StaffRepository staffRepo;
	
	public StaffScheduleService(
			StaffScheduleRepository staffScheduleRepo, 
			StaffRepository staffRepo
	) {
		this.staffScheduleRepo = staffScheduleRepo;
		this.staffRepo = staffRepo;
	}
	
	@Transactional
	public ScheduleResponse create(ScheduleCreateRequest req) {
		if (req.getStartAt().compareTo(req.getEndAt()) >= 0) {
			throw new IllegalArgumentException("Start time must be before end time");
		}
		
		Staff staff = staffRepo.findById(req.getStaffId())
				.orElseThrow(() -> new IllegalArgumentException("Staff not found"));
		
		if (!staff.isActive() || !staff.getUser().isActive()) {
			throw new IllegalArgumentException("Staff is inactive");
		}
		
		Department dept = staff.getDepartment();
		if (!dept.isActive()) {
			throw new IllegalArgumentException("Department is inactive");
		}
		
		if (staffScheduleRepo.existsOverlap(staff.getId(), 
				req.getStartAt(), 
				req.getEndAt())) 
		{
			throw new IllegalStateException("Schedule overlaps existing shift");
		}
		
		StaffSchedule schedule = new StaffSchedule();
		schedule.setStaff(staff);
		schedule.setDepartment(dept);
		schedule.setStartAt(req.getStartAt());
		schedule.setEndAt(req.getEndAt());
		schedule.setShiftType(req.getShiftType());
		schedule.setNotes(req.getNotes());
		schedule.setActive(true);
		return mapToResponse(staffScheduleRepo.save(schedule));
	}
	
	public List<ScheduleResponse> list(Boolean onlyActive) {
		boolean active = (onlyActive == null) ?true : onlyActive;
		List<StaffSchedule> list = staffScheduleRepo.findAllByActive(active);
		List<ScheduleResponse> out = new ArrayList<>();
		for (StaffSchedule s : list) {
			out.add(mapToResponse(s));
		}
		return out;
	}
	
	@Transactional
	public ScheduleResponse update(Long id, ScheduleUpdateRequest req) {
		StaffSchedule schedule = staffScheduleRepo.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Schdule not found"));
		
		if (req.getStartAt().compareTo(req.getEndAt()) >= 0) {
			throw new IllegalArgumentException("Start time must be before end time");
		}
		
		if (staffScheduleRepo.existsOverlapExcludingSelf(schedule.getId(), 
				schedule.getStaff().getId(), 
				req.getStartAt(), 
				req.getEndAt())) 
		{
			throw new IllegalStateException("Schedule overlaps existing shift");
		}
		schedule.setStartAt(req.getStartAt());
		schedule.setEndAt(req.getEndAt());
		schedule.setShiftType(req.getShiftType());
		schedule.setNotes(req.getNotes());
		
		return mapToResponse(staffScheduleRepo.save(schedule));
	}
	
	@Transactional
	public void deactivate(Long id) {
		StaffSchedule s = staffScheduleRepo.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Schedule not found"));
		s.setActive(false);
		staffScheduleRepo.save(s);
	}
	
	@Transactional
	public void activate(Long id) {
		StaffSchedule s = staffScheduleRepo.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Schedule not found"));
		if (staffScheduleRepo.existsOverlapExcludingSelf(
				s.getId(), 
				s.getStaff().getId(), 
				s.getStartAt(), 
				s.getEndAt())) 
		{
			throw new IllegalStateException("Cannot activate due to overlapping schedule");
		}
		s.setActive(true);
		staffScheduleRepo.save(s);
	}
	
	private ScheduleResponse mapToResponse(StaffSchedule s) {
		ScheduleResponse r = new ScheduleResponse();
		r.setId(s.getId());
		r.setActive(s.isActive());
		r.setStartAt(s.getStartAt());
		r.setEndAt(s.getEndAt());
		r.setShiftType(s.getShiftType().name());
		r.setNotes(s.getNotes());
		
		r.setStaffId(s.getStaff().getId());
		r.setStaffName(s.getStaff().getFirstName() + " " + s.getStaff().getLastName());
		r.setUsername(s.getStaff().getUser().getUserName());
		
		List<String> roles = new ArrayList<>();
		for (UserRoles ur : s.getStaff().getUser().getUserRoles()) {
			roles.add(ur.getRole().getName());
		}
		r.setRoles(roles);
		
		r.setDepartmentId(s.getDepartment().getId());
		r.setDepartmentName(s.getDepartment().getName());
		return r;
		
	}

}
