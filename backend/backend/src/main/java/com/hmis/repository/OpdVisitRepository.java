package com.hmis.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hmis.enums.VisitStatus;
import com.hmis.model.OpdVisit;

public interface OpdVisitRepository extends JpaRepository<OpdVisit, Long>{
	
	@EntityGraph(attributePaths = {
			"patient",
			"doctor",
			"doctor.user",
			"department"
	})
	Optional<OpdVisit> findById(Long id);
	
	@Query("""
			SELECT v FROM OpdVisit v
			WHERE v.active = true
				AND (:status IS NULL OR v.status = :status)
				AND (:doctorId IS NULL OR v.doctor.id = :doctorId)
				AND (:departmentId IS NULL OR v.department.id = :departmentId)
				AND (v.checkInAt >= :from AND v.checkInAt < :to)
			ORDER BY v.checkInAt ASC
			""")
	@EntityGraph(attributePaths = {
			"patient",
	        "doctor",
	        "doctor.user",
	        "department"
	})
	List<OpdVisit> findQueue(VisitStatus status, 
			Long doctorId, 
			Long departmentId, 
			Instant from, 
			Instant to);
	
	@Query("""
			SELECT v FROM OpdVisit v
			WHERE v.active = true
				AND v.doctor.id = :doctorId
				AND (v.status = com.hmis.enums.VisitStatus.CHECKED_IN 
					OR v.status = com.hmis.enums.VisitStatus.IN_PROGRESS)
				AND (v.checkInAt >= :from AND v.checkInAt < :to)
			ORDER BY v.checkInAt ASC
			""")
	@EntityGraph(attributePaths = {
			"patient",
	        "doctor",
	        "doctor.user",
	        "department"
	})
	List<OpdVisit> findDoctorQueue(Long doctorId, Instant from, Instant to);
	
	@Query("""
			SELECT v FROM OpdVisit v
			WHERE v.active = true
			AND v.doctor.id = :doctorId
			AND (:status IS NULL OR v.status = :status)
			AND (v.checkInAt >= :from AND v.checkInAt < :to)
			ORDER BY v.checkInAt ASC
			""")
	@EntityGraph(attributePaths = {
			"patient",
			"doctor",
			"doctor.user",
			"department"
	})
	List<OpdVisit> findDoctorVisits(Long doctorId, VisitStatus status, Instant from, Instant to);

}
