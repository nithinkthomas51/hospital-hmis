package com.hmis.repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.hmis.model.PatientVitals;

public interface PatientVitalsRepository extends JpaRepository<PatientVitals, Long>{
	
	@EntityGraph(attributePaths = {
			"recordedBy",
			"recordedBy.user"
	})
	List<PatientVitals> findByOpdVisitIdOrderByRecordedAtDesc(Long opdVisitId);
}
