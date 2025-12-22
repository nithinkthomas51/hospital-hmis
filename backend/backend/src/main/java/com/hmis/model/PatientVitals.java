package com.hmis.model;

import java.math.BigDecimal;
import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table
public class PatientVitals {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "opd_visit_id", nullable = false)
	private OpdVisit opdVisit;
	
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recorded_by_staff_id", nullable = false)
    private Staff recordedBy;

    @Column(nullable = false)
    private Instant recordedAt;

    @Column(name = "height_cm")
    private Integer heightCm;

    @Column(name = "weight_kg", precision = 5, scale = 2)
    private BigDecimal weightKg;

    @Column(name = "bp_systolic")
    private Integer bpSystolic;

    @Column(name = "bp_diastolic")
    private Integer bpDiastolic;

    @Column(name = "temperature_c", precision = 4, scale = 1)
    private BigDecimal temperatureC;

    @Column
    private Integer pulse;

    @Column
    private Integer spo2;

    public PatientVitals() {}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public OpdVisit getOpdVisit() {
		return opdVisit;
	}

	public void setOpdVisit(OpdVisit opdVisit) {
		this.opdVisit = opdVisit;
	}

	public Staff getRecordedBy() {
		return recordedBy;
	}

	public void setRecordedBy(Staff recordedBy) {
		this.recordedBy = recordedBy;
	}

	public Instant getRecordedAt() {
		return recordedAt;
	}

	public void setRecordedAt(Instant recordedAt) {
		this.recordedAt = recordedAt;
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
