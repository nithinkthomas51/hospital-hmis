package com.hmis.dto.staff;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class StaffUpdateRequest {
	
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
	
	public StaffUpdateRequest() {}

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
