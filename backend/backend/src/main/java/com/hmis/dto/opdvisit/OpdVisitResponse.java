package com.hmis.dto.opdvisit;

import java.time.Instant;
import java.time.LocalDate;

public class OpdVisitResponse {
	
	private Long id;
	private boolean active;
	
	private String status;
	private Instant checkInAt;
	private Instant completedAt;
	
	private Long patientId;
	private String patientOpNumber;
	private String patientName;
	private LocalDate patientDob;
	private String patientGender;
	private String patientPhone;
	
	private Long doctorStaffId;
	private String doctorName;
	private String doctorUsername;
	
	private Long departmentId;
	private String departmentName;
	
	public OpdVisitResponse() {}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Instant getCheckInAt() {
		return checkInAt;
	}

	public void setCheckInAt(Instant checkInAt) {
		this.checkInAt = checkInAt;
	}

	public Instant getCompletedAt() {
		return completedAt;
	}

	public void setCompletedAt(Instant completedAt) {
		this.completedAt = completedAt;
	}

	public Long getPatientId() {
		return patientId;
	}

	public void setPatientId(Long patientId) {
		this.patientId = patientId;
	}

	public String getPatientOpNumber() {
		return patientOpNumber;
	}

	public void setPatientOpNumber(String patientOpNumber) {
		this.patientOpNumber = patientOpNumber;
	}

	public String getPatientName() {
		return patientName;
	}

	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}

	public LocalDate getPatientDob() {
		return patientDob;
	}

	public void setPatientDob(LocalDate patientDob) {
		this.patientDob = patientDob;
	}

	public String getPatientGender() {
		return patientGender;
	}

	public void setPatientGender(String patientGender) {
		this.patientGender = patientGender;
	}

	public String getPatientPhone() {
		return patientPhone;
	}

	public void setPatientPhone(String patientPhone) {
		this.patientPhone = patientPhone;
	}

	public Long getDoctorStaffId() {
		return doctorStaffId;
	}

	public void setDoctorStaffId(Long doctorStaffId) {
		this.doctorStaffId = doctorStaffId;
	}

	public String getDoctorName() {
		return doctorName;
	}

	public void setDoctorName(String doctorName) {
		this.doctorName = doctorName;
	}

	public String getDoctorUsername() {
		return doctorUsername;
	}

	public void setDoctorUsername(String doctorUsername) {
		this.doctorUsername = doctorUsername;
	}

	public Long getDepartmentId() {
		return departmentId;
	}

	public void setDepartmentId(Long departmentId) {
		this.departmentId = departmentId;
	}

	public String getDepartmentName() {
		return departmentName;
	}

	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}

}
