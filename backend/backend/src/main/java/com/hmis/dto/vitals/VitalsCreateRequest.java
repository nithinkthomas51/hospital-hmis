package com.hmis.dto.vitals;

import java.math.BigDecimal;

public class VitalsCreateRequest {
	
	private Integer heightCm;
	private BigDecimal weightKg;
	private Integer bpSystolic;
	private Integer bpDiastolic;
	private BigDecimal temperatureC;
	private Integer pulse;
	private Integer spo2;
	
	public VitalsCreateRequest() {}

	public Integer getHeightCm() {
		return heightCm;
	}

	public void setHeightCm(Integer heightcm) {
		this.heightCm = heightcm;
	}

	public BigDecimal getWeightKg() {
		return weightKg;
	}

	public void setWeightKg(BigDecimal weightkg) {
		this.weightKg = weightkg;
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
