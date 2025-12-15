package com.hmis.security;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
	
	private static final String SECRET = "2fad86c392ef82a752e9df066aedaaa5f483cff432deeec972acda8db81963f4";
	private static final long EXPIRATION_MS = 24 * 60 * 60 * 1000;
	
	private static Key key = Keys.hmacShaKeyFor(SECRET.getBytes());
	
	public String extractUsername(String token) {
		return extractClaim(token, Claims::getSubject);
	}
	
	public Date extractExpiration(String token) {
		return extractClaim(token, Claims::getExpiration);
	}
	
	public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
		final Claims claims = extractAllClaims(token);
		return claimsResolver.apply(claims);
	}
	
	private Claims extractAllClaims(String token) {
		return Jwts.parserBuilder()
				.setSigningKey(key)
				.build()
				.parseClaimsJws(token)
				.getBody();
	}
	
	private boolean isTokenExpired(String token) {
		return extractExpiration(token).before(new Date());
	}
	
	public String generateToken(UserDetails userDetails) {
		return createToken(userDetails.getUsername());
	}
	
	private String createToken(String subject) {
		Date now = new Date();
		Date expiry = new Date(now.getTime() + EXPIRATION_MS);
		return Jwts.builder()
				.setSubject(subject)
				.setIssuedAt(now)
				.setExpiration(expiry)
				.signWith(key, SignatureAlgorithm.HS256)
				.compact();
	}
	
	public boolean validateToken(String token, UserDetails userDetails) {
		final String userName = extractUsername(token);
		return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
	}

}
