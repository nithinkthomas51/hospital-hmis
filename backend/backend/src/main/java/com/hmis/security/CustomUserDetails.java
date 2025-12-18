package com.hmis.security;

import java.util.Collection;
import java.util.stream.Collectors;

import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.hmis.model.UserRoles;
import com.hmis.model.Users;

public class CustomUserDetails implements UserDetails {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private final Users user;
	
	public CustomUserDetails(Users user) {
		this.user = user;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return user.getUserRoles()
				.stream()
				.map(UserRoles::getRole)
				.map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
				.collect(Collectors.toSet());
	}

	@Override
	public @Nullable String getPassword() {
		return user.getPassword();
	}

	@Override
	public String getUsername() {
		return user.getUserName();
	}
	
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}
	
	@Override
	public boolean isAccountNonLocked() {
		return true;
	}
	
	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}
	
	@Override
	public boolean isEnabled() {
		return user.isActive();
	}
	
	public Users getUser() {
		return user;
	}
	

}
