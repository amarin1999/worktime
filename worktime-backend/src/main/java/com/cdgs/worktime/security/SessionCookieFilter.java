package com.cdgs.worktime.security;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.WebUtils;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/** Authenticates the request from the HttpOnly session cookie. */
public class SessionCookieFilter extends OncePerRequestFilter {

	public static final String COOKIE_NAME = "WT_SESSION";

	private final TokenService tokens;

	public SessionCookieFilter(TokenService tokens) {
		this.tokens = tokens;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {
		Cookie cookie = WebUtils.getCookie(request, COOKIE_NAME);
		if (cookie != null && !cookie.getValue().isBlank()) {
			tokens.verify(cookie.getValue()).ifPresent(user -> {
				List<GrantedAuthority> authorities = new ArrayList<>();
				authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
				if (user.admin()) {
					authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
				}
				var authentication = UsernamePasswordAuthenticationToken.authenticated(user, null, authorities);
				var context = SecurityContextHolder.createEmptyContext();
				context.setAuthentication(authentication);
				SecurityContextHolder.setContext(context);
			});
		}
		chain.doFilter(request, response);
	}
}
