package com.hmis.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hmis.dto.department.DepartmentCreateRequest;
import com.hmis.dto.department.DepartmentResponse;
import com.hmis.dto.department.DepartmentUpdateRequest;
import com.hmis.model.Department;
import com.hmis.repository.DepartmentRepository;

@Service
public class DepartmentService {
	
	private final DepartmentRepository departmentRepo;
	
	public DepartmentService(DepartmentRepository departmentRepo) {
		this.departmentRepo = departmentRepo;
	}
	
	@Transactional
	public DepartmentResponse create(DepartmentCreateRequest req) {
		String name = req.getName().trim();
		
		departmentRepo.findByNameIgnoreCase(name).ifPresent(d -> {
			throw new IllegalArgumentException("Department already exists: " + name);
		});
		
		Department d = new Department();
		d.setName(name);
		d.setDescription(req.getDescription());
		
		Department saved = departmentRepo.save(d);
		return toResponse(saved);
	}
	
	@Transactional(readOnly = true)
	public List<DepartmentResponse> list(boolean onlyActive) {
		
		List<Department> depts = onlyActive
				? departmentRepo.findAllByActiveTrueOrderByNameAsc()
				: departmentRepo.findAllByOrderByNameAsc();
		
		return depts.stream().map(this::toResponse).toList();
		
	}
	
	@Transactional
	public DepartmentResponse update(Long id, DepartmentUpdateRequest req) {
		Department d = departmentRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Department not found: " + id));
		
		if (req.getName() != null) {
			String newName = req.getName().trim();
			departmentRepo.findByNameIgnoreCase(newName).ifPresent(existing -> {
				if (!existing.getId().equals(id)) {
					throw new IllegalArgumentException("Department name already exists: " + newName);
				}
			});
			d.setName(newName);
		}
		
		if (req.getDescription() != null) {
			d.setDescription(req.getDescription());
		}
		
		if (req.getActive() != null) {
			d.setActive(req.getActive());
		}
		
		Department saved = departmentRepo.save(d);
		return toResponse(saved);
	}
	
	@Transactional
	public void deactivate(Long id) {
		Department d = departmentRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Department not found: " + id));
		d.setActive(false);
		departmentRepo.save(d);
	}
	
	private DepartmentResponse toResponse(Department d) {
		return new DepartmentResponse(
				d.getId(), 
				d.getName(), 
				d.getDescription(), 
				d.isActive(), 
				d.getCreatedAt(), 
				d.getUpdatedAt()
				);
	}

}
