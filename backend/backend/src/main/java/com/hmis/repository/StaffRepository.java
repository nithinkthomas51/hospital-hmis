package com.hmis.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.hmis.model.Staff;

public interface StaffRepository extends JpaRepository<Staff, Long> {
	
	boolean existsByUser_Id(Long userId);
	
	@EntityGraph(attributePaths = {"user", "department", "user.userRoles", "user.userRoles.role"})
	Optional<Staff> findWithUserAndDepartmentById(Long id);
	
	@EntityGraph(attributePaths = {"user", "department", "user.userRoles", "user.userRoles.role"})
	List<Staff> findAllByActiveTrue();
	
	@EntityGraph(attributePaths = {"user", "department", "user.userRoles", "user.userRoles.role"})
	List<Staff> findAllByActive(boolean active);
}
