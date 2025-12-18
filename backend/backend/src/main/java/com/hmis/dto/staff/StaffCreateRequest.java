package com.hmis.dto.staff;

import java.util.List;

import com.hmis.security.RoleName;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class StaffCreateRequest {
	
	@NotBlank
	@Size(min = 3, max = 50)
	private String username;
	
	@NotBlank
	@Email
	@Size(max = 120)
	private String email;
	
	@NotBlank
	@Size(min = 8, max = 120)
	private String password;
	
	@NotNull
	private List<RoleName> roles;
	
	@NotNull
	private Long departmentId;
	
	@NotBlank
	@Size(max = 80)
	private String firstName;
	
	@NotBlank
	@Size(max = 80)
	private String lastName;
	
	@Size(max = 30)
	private String phone;
	
	@Size(max = 100)
	private String designation;
	
	public StaffCreateRequest() {}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public List<RoleName> getRoles() {
		return roles;
	}

	public void setRoles(List<RoleName> roles) {
		this.roles = roles;
	}

	public Long getDepartmentId() {
		return departmentId;
	}

	public void setDepartmentId(Long departmentId) {
		this.departmentId = departmentId;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getDesignation() {
		return designation;
	}

	public void setDesignation(String designation) {
		this.designation = designation;
	}

}
