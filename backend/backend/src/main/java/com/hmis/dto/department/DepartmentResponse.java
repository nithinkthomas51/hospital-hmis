package com.hmis.dto.department;

import java.time.Instant;

public class DepartmentResponse {
	
	private Long id;
	private String name;
	private String description;
	private boolean active;
	private Instant createdAt;
	private Instant updatedAt;
	
	public DepartmentResponse(Long id, String name, String description, boolean active, Instant createdAt,
			Instant updatedAt) {
		super();
		this.id = id;
		this.name = name;
		this.description = description;
		this.active = active;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public Long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public String getDescription() {
		return description;
	}

	public boolean isActive() {
		return active;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}
	
}
