package com.hmis.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hmis.model.StaffSchedule;

public interface StaffScheduleRepository extends JpaRepository<StaffSchedule, Long> {
	
	@Query("""
			SELECT COUNT(s) > 0 FROM StaffSchedule s
			WHERE s.active = true
			AND s.staff.id = :staffId
			AND :startAt < s.endAt
			AND :endAt > s.startAt
			""")
	boolean existsOverlap(Long staffId, Instant startAt, Instant endAt);
	
	@Query("""
			SELECT COUNT(s) > 0 FROM StaffSchedule s
			WHERE s.active = true
			AND s.staff.id = :staffId
			AND s.id <> :scheduleId
			AND :startAt < s.endAt
			AND :endAt > s.startAt
			""")
	boolean existsOverlapExcludingSelf(
			Long scheduleId, 
			Long staffId, 
			Instant startAt, 
			Instant endAt);
	
	@EntityGraph(attributePaths = {
			"staff",
			"staff.user",
			"staff.user.userRoles",
			"staff.user.userRoles.role",
			"department"
	})
	List<StaffSchedule> findAllByActive(boolean active);
	
	@EntityGraph(attributePaths = {
			"staff",
			"staff.user",
			"staff.user.userRoles",
			"staff.user.userRoles.role",
			"department"
	})
	Optional<StaffSchedule> findById(Long id);

}
