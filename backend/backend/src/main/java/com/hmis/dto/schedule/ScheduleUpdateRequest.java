package com.hmis.dto.schedule;

import java.time.Instant;

import com.hmis.enums.ShiftType;

import jakarta.validation.constraints.NotNull;

public class ScheduleUpdateRequest {
	
	@NotNull
	private Instant startAt;
	
	@NotNull
	private Instant endAt;
	
	private ShiftType shiftType;
	
	private String notes;
	
	public ScheduleUpdateRequest() {}

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
