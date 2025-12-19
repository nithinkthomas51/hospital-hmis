package com.hmis.dto.patient;

import java.time.LocalDate;

import com.hmis.enums.Gender;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class PatientUpdateRequest {
	
	@NotBlank
	@Size(max = 80)
	private String firstName;
	
	@NotBlank
	@Size(max = 80)
	private String lastName;
	
	@NotNull
	private LocalDate dob;
	
	@NotNull
	private Gender gender;
	
	@Size(max = 80)
	private String phone;
	
	@Size(max = 80)
	private String email;
	
	@Size(max = 255)
	private String address;
	
	@Size(max = 120)
	private String emergencyContactName;
	
	@Size(max = 30)
	private String emergencyContactPhone;
	
	public PatientUpdateRequest() {}

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

	public LocalDate getDob() {
		return dob;
	}

	public void setDob(LocalDate dob) {
		this.dob = dob;
	}

	public Gender getGender() {
		return gender;
	}

	public void setGender(Gender gender) {
		this.gender = gender;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getEmergencyContactName() {
		return emergencyContactName;
	}

	public void setEmergencyContactName(String emergencyContactName) {
		this.emergencyContactName = emergencyContactName;
	}

	public String getEmergencyContactPhone() {
		return emergencyContactPhone;
	}

	public void setEmergencyContactPhone(String emergencyContactPhone) {
		this.emergencyContactPhone = emergencyContactPhone;
	}

}
