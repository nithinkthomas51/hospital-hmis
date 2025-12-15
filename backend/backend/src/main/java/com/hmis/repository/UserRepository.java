package com.hmis.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hmis.model.Users;

public interface UserRepository extends JpaRepository<Users, Long> {
	
	Optional<Users> findByUserName(String userName);
	boolean existsByUserName(String userName);
	boolean existsByEmail(String email);
}
