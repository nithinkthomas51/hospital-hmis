package com.hmis.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.hmis.model.Role;
import com.hmis.model.UserRoles;
import com.hmis.model.Users;
import com.hmis.repository.RoleRepository;
import com.hmis.repository.UserRepository;
import com.hmis.repository.UserRolesRepository;

@Configuration
public class DataInitializer {
	
	@Bean
	CommandLineRunner initData(RoleRepository roleRepo, 
			UserRepository userRepo, 
			UserRolesRepository userRolesRepo, 
			PasswordEncoder encoder) 
	{
		return args -> {
			
			String[] roles = { "ADMIN", "PATIENT", "DOCTOR", "RECEPTIONIST", "PHARMACIST", "TECHNICIAN" };
			
			for (String roleName : roles) {
				roleRepo.findByName(roleName).orElseGet(() -> {
					System.out.println("Creating Role: " + roleName);
					return roleRepo.save(new Role(roleName));
				});
			}
			
			if (!userRepo.existsByUserName("admin")) {
				Users admin = new Users();
				
				admin.setUserName("admin");
				admin.setEmail("admin@hmis.local");
				admin.setPassword(encoder.encode("admin123"));
				admin.setActive(true);
				
				userRepo.save(admin);
				
				Role adminRole = roleRepo.findByName("ADMIN").orElseThrow();
				UserRoles ur = new UserRoles(admin, adminRole);
				userRolesRepo.save(ur);
				
				System.out.println("Created Admin User");
				
			}
			
		};
		
	}

}
