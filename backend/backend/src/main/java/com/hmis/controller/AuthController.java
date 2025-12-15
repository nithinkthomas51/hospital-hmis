package com.hmis.controller;

import java.util.List;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hmis.dto.LoginRequest;
import com.hmis.dto.LoginResponse;
import com.hmis.security.CustomUserDetails;
import com.hmis.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	
	private final AuthenticationManager authenticationManager;
	private final JwtUtil jwtUtil;
	
	public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
		this.authenticationManager = authenticationManager;
		this.jwtUtil = jwtUtil;
	}
	
	@PostMapping("/login")
	public LoginResponse login(@RequestBody LoginRequest request) {
		Authentication auth = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(
						request.getUsername(), request.getPassword()));
		
		SecurityContextHolder.getContext().setAuthentication(auth);
		CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
		String token = jwtUtil.generateToken(userDetails);
		
		List<String> roles = userDetails.getAuthorities().stream()
				.map(GrantedAuthority::getAuthority)
				.toList();
		
		return new LoginResponse(token, userDetails.getUsername(), roles);
	}

}
