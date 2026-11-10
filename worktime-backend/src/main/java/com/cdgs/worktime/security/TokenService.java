package com.cdgs.worktime.security;

import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.stereotype.Service;

import com.cdgs.worktime.config.SecurityProperties;
import com.cdgs.worktime.employee.Employee;
import com.nimbusds.jose.jwk.source.ImmutableSecret;

/** Issues and verifies the HS256-signed JWT stored in the session cookie. */
@Service
public class TokenService {

	private static final String ISSUER = "worktime";

	private final SecurityProperties properties;
	private final Clock clock;
	private final JwtEncoder encoder;
	private final JwtDecoder decoder;

	public TokenService(SecurityProperties properties, Clock clock) {
		this.properties = properties;
		this.clock = clock;
		SecretKey key = new SecretKeySpec(properties.jwtSecret().getBytes(StandardCharsets.UTF_8), "HmacSHA256");
		this.encoder = new NimbusJwtEncoder(new ImmutableSecret<>(key));
		this.decoder = NimbusJwtDecoder.withSecretKey(key).macAlgorithm(MacAlgorithm.HS256).build();
	}

	public String issue(Employee employee) {
		Instant now = clock.instant();
		JwtClaimsSet claims = JwtClaimsSet.builder().issuer(ISSUER).id(UUID.randomUUID().toString())
				.subject(employee.getEmployeeNo()).issuedAt(now).expiresAt(now.plus(properties.sessionDuration()))
				.claim("eid", employee.getId()).claim("fn", employee.getFirstname())
				.claim("ln", employee.getLastname()).build();
		JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
		return encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
	}

	/** @return the user, or empty when the token is invalid, tampered with or expired. */
	public Optional<CurrentUser> verify(String token) {
		try {
			Jwt jwt = decoder.decode(token);
			if (!ISSUER.equals(jwt.getClaimAsString("iss"))) {
				return Optional.empty();
			}
			Number eid = jwt.getClaim("eid");
			String employeeNo = jwt.getSubject();
			// Admin rights are re-evaluated on every request so removing someone from the list takes effect at once
			return Optional.of(new CurrentUser(eid.longValue(), employeeNo, jwt.getClaimAsString("fn"),
					jwt.getClaimAsString("ln"), properties.isAdmin(employeeNo)));
		} catch (RuntimeException e) { // JwtException, missing/invalid claims
			return Optional.empty();
		}
	}
}
