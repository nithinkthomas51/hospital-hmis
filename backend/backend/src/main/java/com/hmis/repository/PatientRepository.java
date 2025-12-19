package com.hmis.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hmis.model.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long> {
	
	Optional<Patient> findByOpNumberIgnoreCase(String opNumber);
	
	Optional<Patient> findById(Long id);
	
	boolean existsByOpNumber(String opNumber);
	
	List<Patient> findAllByActive(boolean active);
	
	@Query("""
			SELECT p FROM Patient p
			WHERE (:onlyActive IS NULL or p.active = :onlyActive)
			AND (
				LOWER(p.opNumber) LIKE LOWER(CONCAT('%', :q, '%'))
			 OR LOWER(p.firstName) LIKE LOWER(CONCAT('%', :q, '%'))
			 OR LOWER(p.lastName) LIKE LOWER(CONCAT('%', :q, '%'))
			 OR LOWER(CONCAT(p.firstName, ' ', p.lastName)) LIKE LOWER(CONCAT('%', :q, '%'))
			 OR LOWER(p.phone) LIKE LOWER(CONCAT('%', :q, '%'))
			 ) ORDER BY p.id DESC
			""")
	List<Patient> search(String q, Boolean onlyActive);

}
