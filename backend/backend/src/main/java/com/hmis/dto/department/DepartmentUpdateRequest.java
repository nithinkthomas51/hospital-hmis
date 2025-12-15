package com.hmis.dto.department;

import jakarta.validation.constraints.Size;

public class DepartmentUpdateRequest {
	
	@Size(max = 100)
	private String name;
	
	@Size(max = 500)
	private String description;
	
	private Boolean active;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

}
