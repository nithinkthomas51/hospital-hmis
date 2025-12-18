package com.hmis.dto.schedule;

import java.time.Instant;

import com.hmis.enums.ShiftType;

import jakarta.validation.constraints.NotNull;

public class ScheduleCreateRequest {
	
	@NotNull
	private Long staffId;
	
	@NotNull
	private Instant startAt;
	
	@NotNull
	private Instant endAt;
	
	@NotNull
	private ShiftType shiftType;
	
	private String notes;
	
	public ScheduleCreateRequest() {}

	public Long getStaffId() {
		return staffId;
	}

	public void setStaffId(Long staffId) {
		this.staffId = staffId;
	}

	public Instant getStartAt() {
		return startAt;
	}

	public void setStartAt(Instant startAt) {
		this.startAt = startAt;
	}

	public Instant getEndAt() {
		return endAt;
	}

	public void setEndAt(Instant endAt) {
		this.endAt = endAt;
	}

	public ShiftType getShiftType() {
		return shiftType;
	}

	public void setShiftType(ShiftType shiftType) {
		this.shiftType = shiftType;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

}
