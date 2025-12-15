package com.hmis.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hmis.model.Department;

public interface DepartmentRepository extends JpaRepository<Department, Long>{
	
	Optional<Department> findByNameIgnoreCase(String name);
	List<Department> findAllByActiveTrueOrderByNameAsc();
	List<Department> findAllByOrderByNameAsc();

}
