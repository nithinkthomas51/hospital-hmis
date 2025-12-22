package com.hmis.dto.vitals;

import java.math.BigDecimal;
import java.time.Instant;

public class VitalsResponse {
	
	private Long id;
	private Long visitId;
	
	private Instant recordedAt;
	private Long recordedByStaffId;
	private String recordedByName;
	
	private Integer heightCm;
	private BigDecimal weightKg;
	private Integer bpSystolic;
	private Integer bpDiastolic;
	private BigDecimal temperatureC;
	private Integer pulse;
	private Integer spo2;
	
	public VitalsResponse() {}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getVisitId() {
		return visitId;
	}

	public void setVisitId(Long visitId) {
		this.visitId = visitId;
	}

	public Instant getRecordedAt() {
		return recordedAt;
	}

	public void setRecordedAt(Instant recordedAt) {
		this.recordedAt = recordedAt;
	}

	public Long getRecordedByStaffId() {
		return recordedByStaffId;
	}

	public void setRecordedByStaffId(Long recordedByStaffId) {
		this.recordedByStaffId = recordedByStaffId;
	}

	public String getRecordedByName() {
		return recordedByName;
	}

	public void setRecordedByName(String recordedByName) {
		this.recordedByName = recordedByName;
	}

	public Integer getHeightCm() {
		return heightCm;
	}

	public void setHeightCm(Integer heightCm) {
		this.heightCm = heightCm;
	}

	public BigDecimal getWeightKg() {
		return weightKg;
	}

	public void setWeightKg(BigDecimal weightKg) {
		this.weightKg = weightKg;
	}

	public Integer getBpSystolic() {
		return bpSystolic;
	}

	public void setBpSystolic(Integer bpSystolic) {
		this.bpSystolic = bpSystolic;
	}

	public Integer getBpDiastolic() {
		return bpDiastolic;
	}

	public void setBpDiastolic(Integer bpDiastolic) {
		this.bpDiastolic = bpDiastolic;
	}

	public BigDecimal getTemperatureC() {
		return temperatureC;
	}

	public void setTemperatureC(BigDecimal temperatureC) {
		this.temperatureC = temperatureC;
	}

	public Integer getPulse() {
		return pulse;
	}

	public void setPulse(Integer pulse) {
		this.pulse = pulse;
	}

	public Integer getSpo2() {
		return spo2;
	}

	public void setSpo2(Integer spo2) {
		this.spo2 = spo2;
	}

}
