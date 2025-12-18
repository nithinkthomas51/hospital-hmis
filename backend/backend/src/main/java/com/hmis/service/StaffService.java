package com.hmis.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hmis.dto.staff.StaffCreateRequest;
import com.hmis.dto.staff.StaffResponse;
import com.hmis.dto.staff.StaffUpdateRequest;
import com.hmis.model.Department;
import com.hmis.model.Role;
import com.hmis.model.Staff;
import com.hmis.model.UserRoles;
import com.hmis.model.Users;
import com.hmis.repository.DepartmentRepository;
import com.hmis.repository.RoleRepository;
import com.hmis.repository.StaffRepository;
import com.hmis.repository.UserRepository;
import com.hmis.security.RoleName;

import jakarta.transaction.Transactional;

@Service
public class StaffService {
	
	private final StaffRepository staffRepo;
	private final UserRepository userRepo;
	private final RoleRepository roleRepo;
	private final DepartmentRepository departmentRepo;
	private final PasswordEncoder passwordEncoder;
	
	public StaffService(
			StaffRepository staffRepo, 
			UserRepository userRepo, 
			RoleRepository roleRepo, 
			DepartmentRepository departmentRepo, 
			PasswordEncoder passwordEncoder
	) {
		this.staffRepo = staffRepo;
		this.userRepo = userRepo;
		this.roleRepo = roleRepo;
		this.departmentRepo = departmentRepo;
		this.passwordEncoder = passwordEncoder;
	}
	
	@Transactional
	public StaffResponse create(StaffCreateRequest req) {
		if (userRepo.existsByUserName(req.getUsername())) {
			throw new IllegalArgumentException("Username already exists!");
		}
		
		if (userRepo.existsByEmail(req.getEmail())) {
			throw new IllegalArgumentException("Email already exists");
		}
		
		Department dept = departmentRepo.findById(req.getDepartmentId()).orElseThrow(
				() -> new IllegalArgumentException("Department not found"));
		
		if (!dept.isActive()) {
			throw new IllegalArgumentException("Cannot assign inactive department");
		}
		
		Users user = new Users();
		user.setUserName(req.getUsername());
		user.setEmail(req.getEmail());
		user.setPassword(passwordEncoder.encode(req.getPassword()));
		user.setActive(true);
		
		for (RoleName roleName : req.getRoles()) {
			if (roleName == RoleName.ADMIN) {
				throw new IllegalArgumentException("ADMIN role cannot be assigned via staff creation");
			}
			Role role = roleRepo.findByName(roleName.name()).orElseThrow(
					() -> new IllegalArgumentException("Role not found: " + roleName.name()));
			user.addRole(role);
		}
		
		Users savedUser = userRepo.save(user);
		
		Staff staff = new Staff();
		staff.setUser(savedUser);
		staff.setDepartment(dept);
		staff.setFirstName(req.getFirstName());
		staff.setLastName(req.getLastName());
		staff.setPhone(req.getPhone());
		staff.setDesignation(req.getDesignation());
		staff.setActive(true);
		
		Staff savedStaff = staffRepo.save(staff);
		
		return mapToResponse(savedStaff);
		
	}
	
	public List<StaffResponse> list(Boolean onlyActive) {
		boolean active = (onlyActive == null) ? true : onlyActive.booleanValue();
		
		List<Staff> stafflist = staffRepo.findAllByActive(active);
		List<StaffResponse> out = new ArrayList<>();
		
		for (Staff s : stafflist) {
			out.add(mapToResponse(s));
		}
		
		return out;
	}
	
	@Transactional
	public StaffResponse update(Long staffId, StaffUpdateRequest req) {
		Staff staff = staffRepo.findWithUserAndDepartmentById(staffId)
				.orElseThrow(() -> new IllegalArgumentException("Staff not found"));
		
		Department dept = departmentRepo.findById(req.getDepartmentId())
				.orElseThrow(() -> new IllegalArgumentException("Department not found"));
		
		if (!dept.isActive()) {
			throw new IllegalArgumentException("Cannot assign inactive department");
		}
		
		staff.setDepartment(dept);
		staff.setFirstName(req.getFirstName());
		staff.setLastName(req.getLastName());
		staff.setPhone(req.getPhone());
		staff.setDesignation(req.getDesignation());
		
		Staff saved = staffRepo.save(staff);
		
		return mapToResponse(saved);
	}
	
	@Transactional
	public void deactivate(Long staffId) {
		Staff staff = staffRepo.findById(staffId)
				.orElseThrow(() -> new IllegalArgumentException("Staff not found"));
		staff.setActive(false);
		Users user = staff.getUser();
		user.setActive(false);
		userRepo.save(user);
		staffRepo.save(staff);
	}
	
	@Transactional
	public void activate(Long staffId) {
		Staff staff = staffRepo.findById(staffId)
				.orElseThrow(() -> new IllegalArgumentException("Staff not found"));
		staff.setActive(true);
		Users user = staff.getUser();
		user.setActive(true);
		userRepo.save(user);
		staffRepo.save(staff);
	}
	
	private StaffResponse mapToResponse(Staff staff) {
		StaffResponse res = new StaffResponse();
		res.setId(staff.getId());
		res.setActive(staff.isActive());
		
		res.setUserId(staff.getUser().getId());
		res.setUsername(staff.getUser().getUserName());
		res.setEmail(staff.getUser().getEmail());
		
		List<String> roles = new ArrayList<>();
		for (UserRoles ur : staff.getUser().getUserRoles()) {
			roles.add(ur.getRole().getName());
		}
		res.setRoles(roles);
		
		res.setDepartmentId(staff.getDepartment().getId());
		res.setDepartmentName(staff.getDepartment().getName());
		
		res.setFirstName(staff.getFirstName());
		res.setLastName(staff.getLastName());
		res.setPhone(staff.getPhone());
		res.setDesignation(staff.getDesignation());
		
		return res;
		
	}

}
