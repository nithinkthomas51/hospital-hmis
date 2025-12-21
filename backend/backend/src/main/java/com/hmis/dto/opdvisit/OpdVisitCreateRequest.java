package com.hmis.dto.opdvisit;

import jakarta.validation.constraints.NotNull;

public class OpdVisitCreateRequest {
	
	@NotNull
	private String patientOpNumber;
	
	@NotNull
	private Long departmentId;
	
	@NotNull
	private Long doctorId;
	
	public OpdVisitCreateRequest() {}

	public String getPatientOpNumber() {
		return patientOpNumber;
	}

	public void setPatientOpNumber(String patientOpNumber) {
		this.patientOpNumber = patientOpNumber;
	}

	public Long getDepartmentId() {
		return departmentId;
	}

	public void setDepartmentId(Long departmentId) {
		this.departmentId = departmentId;
	}

	public Long getDoctorId() {
		return doctorId;
	}

	public void setDoctorId(Long doctorId) {
		this.doctorId = doctorId;
	}

}
