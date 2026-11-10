package com.cdgs.worktime.security;

import java.util.List;

import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter.ReferrerPolicy;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.cdgs.worktime.config.SecurityProperties;

import jakarta.servlet.http.HttpServletResponse;

/** Web security; not loaded for the maintenance command (no web server). */
@Configuration
@ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.SERVLET)
public class SecurityConfig {

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http, TokenService tokens, SecurityProperties props)
			throws Exception {
		CookieCsrfTokenRepository csrfRepository = CookieCsrfTokenRepository.withHttpOnlyFalse();
		// Path "/" so the SPA (served outside /workTimeAPI) can read the token from document.cookie
		csrfRepository.setCookiePath("/");
		csrfRepository.setCookieCustomizer(c -> c.secure(props.secureCookie()).sameSite("Strict"));

		http.sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.httpBasic(b -> b.disable())
				.formLogin(f -> f.disable())
				.logout(l -> l.disable())
				.requestCache(c -> c.disable())
				.cors(props.allowedOrigins().isEmpty() ? c -> c.disable() : Customizer.withDefaults())
				.csrf(c -> c.spa().csrfTokenRepository(csrfRepository))
				.addFilterBefore(new SessionCookieFilter(tokens), BasicAuthenticationFilter.class)
				.authorizeHttpRequests(auth -> auth
						.requestMatchers(HttpMethod.GET, "/api/auth/csrf").permitAll()
						.requestMatchers(HttpMethod.POST, "/api/auth/login", "/api/auth/logout").permitAll()
						.requestMatchers("/error").permitAll()
						.requestMatchers("/api/admin/**").hasRole("ADMIN")
						.requestMatchers("/api/**").hasRole("USER")
						.anyRequest().denyAll())
				.exceptionHandling(e -> e
						.authenticationEntryPoint((req, res, ex) -> writeProblem(res, HttpStatus.UNAUTHORIZED,
								"กรุณาเข้าสู่ระบบ"))
						.accessDeniedHandler((req, res, ex) -> writeProblem(res, HttpStatus.FORBIDDEN,
								"ไม่มีสิทธิ์ใช้งาน")))
				.headers(h -> h
						.contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'none'; frame-ancestors 'none'"))
						.frameOptions(f -> f.deny())
						.referrerPolicy(r -> r.policy(ReferrerPolicy.NO_REFERRER))
						.httpStrictTransportSecurity(hsts -> hsts.includeSubDomains(true).maxAgeInSeconds(31_536_000)));
		return http.build();
	}

	@Bean
	CorsConfigurationSource corsConfigurationSource(SecurityProperties props) {
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowedOrigins(props.allowedOrigins());
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
		config.setAllowedHeaders(List.of("Content-Type", "X-XSRF-TOKEN"));
		config.setExposedHeaders(List.of("Content-Disposition"));
		config.setAllowCredentials(true);
		config.setMaxAge(3600L);
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/api/**", config);
		return source;
	}

	private static void writeProblem(HttpServletResponse res, HttpStatus status, String detail)
			throws java.io.IOException {
		res.setStatus(status.value());
		res.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
		res.setCharacterEncoding("UTF-8");
		res.getWriter().write("{\"title\":\"" + status.getReasonPhrase() + "\",\"status\":" + status.value()
				+ ",\"detail\":\"" + detail + "\"}");
	}
}
