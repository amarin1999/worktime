package com.cdgs.worktime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

/**
 * Runs in its own application context: spring-security-test's {@code csrf()} post-processor (used by the other
 * tests) replaces the cookie repository of a shared context.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_CLASS)
class CsrfCookieTest {

	@Autowired
	MockMvc mvc;

	@Test
	void csrfEndpointIssuesReadableSecureCookie() throws Exception {
		MvcResult result = mvc.perform(get("/api/auth/csrf")).andExpect(status().isNoContent()).andReturn();
		// SameSite=Strict is set as a cookie attribute; MockMvc does not render it (checked against Tomcat in E2E)
		assertThat(result.getResponse().getHeaders("Set-Cookie")).anySatisfy(c -> assertThat(c)
				.startsWith("XSRF-TOKEN=").contains("Path=/;").contains("Secure").doesNotContain("HttpOnly"));
	}
}
