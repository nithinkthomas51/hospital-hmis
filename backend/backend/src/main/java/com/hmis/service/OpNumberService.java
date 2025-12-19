package com.hmis.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class OpNumberService {
	
	private final JdbcTemplate jdbcTemplate;
	
	public OpNumberService(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}
	
	public String nextOpNumber() {
		Long nextVal = jdbcTemplate.queryForObject("SELECT nextval('patient_op_seq')", Long.class);
		return String.format("OP%04d", nextVal);
	}

}
