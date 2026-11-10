package com.cdgs.worktime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import com.cdgs.worktime.isservice.IsServiceClient;
import com.jayway.jsonpath.JsonPath;

import jakarta.servlet.http.Cookie;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional // each test rolls back its data
class ApiSecurityIntegrationTest {

	private static final String PASSWORD = "correct-password";

	@Autowired
	MockMvc mvc;

	@MockitoBean
	IsServiceClient isService;

	@BeforeEach
	void stubIsService() {
		when(isService.checkUserAuthentication(anyString(), anyString())).thenReturn(false);
		when(isService.checkUserAuthentication(anyString(), eq(PASSWORD))).thenReturn(true);
		when(isService.getLeaves(anyString(), any(), any())).thenReturn(List.of());
	}

	@Test
	void apiRequiresLogin() throws Exception {
		mvc.perform(get("/api/sidework")).andExpect(status().isUnauthorized())
				.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON));
		mvc.perform(get("/api/auth/me")).andExpect(status().isUnauthorized());
	}

	@Test
	void forgedOrTamperedCookieIsRejected() throws Exception {
		Cookie valid = login("C0002");
		String tampered = valid.getValue().substring(0, valid.getValue().length() - 3) + "abc";
		mvc.perform(get("/api/auth/me").cookie(new Cookie("WT_SESSION", tampered))).andExpect(status().isUnauthorized());
		mvc.perform(get("/api/auth/me").cookie(new Cookie("WT_SESSION", "not-a-jwt"))).andExpect(status().isUnauthorized());
	}

	@Test
	void loginRequiresCsrfToken() throws Exception {
		mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
				.content(loginJson("C0002", PASSWORD))).andExpect(status().isForbidden());
	}

	@Test
	void wrongPasswordOrUnknownEmployeeIsRejected() throws Exception {
		mvc.perform(post("/api/auth/login").with(csrf()).contentType(MediaType.APPLICATION_JSON)
				.content(loginJson("C0002", "wrong"))).andExpect(status().isUnauthorized())
				.andExpect(header().doesNotExist("Set-Cookie"));
		mvc.perform(post("/api/auth/login").with(csrf()).contentType(MediaType.APPLICATION_JSON)
				.content(loginJson("C9999", PASSWORD))).andExpect(status().isUnauthorized());
	}

	@Test
	void repeatedFailuresAreThrottled() throws Exception {
		for (int i = 0; i < 5; i++) {
			mvc.perform(post("/api/auth/login").with(csrf()).with(r -> {
				r.setRemoteAddr("10.0.0.99");
				return r;
			}).contentType(MediaType.APPLICATION_JSON).content(loginJson("C9998", "wrong")))
					.andExpect(status().isUnauthorized());
		}
		mvc.perform(post("/api/auth/login").with(csrf()).with(r -> {
			r.setRemoteAddr("10.0.0.99");
			return r;
		}).contentType(MediaType.APPLICATION_JSON).content(loginJson("C9998", PASSWORD)))
				.andExpect(status().isTooManyRequests());
	}

	@Test
	void sessionCookieIsHardened() throws Exception {
		MvcResult result = mvc.perform(post("/api/auth/login").with(csrf()).contentType(MediaType.APPLICATION_JSON)
				.content(loginJson("C0002", PASSWORD))).andExpect(status().isOk())
				.andExpect(jsonPath("$.employeeNo").value("C0002")).andExpect(jsonPath("$.admin").value(false))
				.andReturn();
		String setCookie = result.getResponse().getHeader("Set-Cookie");
		assertThat(setCookie).contains("WT_SESSION=").contains("HttpOnly").contains("Secure")
				.contains("SameSite=Strict");
	}

	@Test
	void usersCannotTouchEachOthersRecords() throws Exception {
		Cookie alice = login("C0002");
		Cookie bob = login("C0003");

		String body = """
				{"date":"2026-11-02","startTime":"08:30","endTime":"17:30","workAnywhere":1,"remark":"wfh"}""";
		MvcResult created = mvc.perform(post("/api/sidework").cookie(alice).with(csrf())
				.contentType(MediaType.APPLICATION_JSON).content(body)).andExpect(status().isOk())
				.andExpect(jsonPath("$.startTime").value("08:30")).andReturn();
		int id = JsonPath.read(created.getResponse().getContentAsString(), "$.id");

		mvc.perform(get("/api/sidework/" + id).cookie(bob)).andExpect(status().isNotFound());
		mvc.perform(put("/api/sidework/" + id).cookie(bob).with(csrf()).contentType(MediaType.APPLICATION_JSON)
				.content(body)).andExpect(status().isNotFound());
		mvc.perform(delete("/api/sidework/" + id).cookie(bob).with(csrf())).andExpect(status().isNotFound());
		mvc.perform(get("/api/sidework").cookie(bob)).andExpect(jsonPath("$.length()").value(0));

		// Saving the same date again updates instead of duplicating
		mvc.perform(post("/api/sidework").cookie(alice).with(csrf()).contentType(MediaType.APPLICATION_JSON)
				.content(body.replace("08:30", "09:00"))).andExpect(jsonPath("$.id").value(id));
		mvc.perform(get("/api/sidework").cookie(alice)).andExpect(jsonPath("$.length()").value(1))
				.andExpect(jsonPath("$[0].startTime").value("09:00"));

		mvc.perform(get("/api/employees/by-day").param("date", "2026-11-02").cookie(bob))
				.andExpect(jsonPath("$[0].employeeNo").value("C0002"));

		mvc.perform(delete("/api/sidework/" + id).cookie(alice).with(csrf())).andExpect(status().isNoContent());
		mvc.perform(get("/api/sidework/" + id).cookie(alice)).andExpect(status().isNotFound());
	}

	@Test
	void writesRequireCsrfEvenWhenLoggedIn() throws Exception {
		Cookie alice = login("C0002");
		mvc.perform(post("/api/sidework").cookie(alice).contentType(MediaType.APPLICATION_JSON).content("""
				{"date":"2026-11-03","startTime":"08:30","endTime":"17:30","workAnywhere":1}"""))
				.andExpect(status().isForbidden());
	}

	@Test
	void invalidInputIsRejected() throws Exception {
		Cookie alice = login("C0002");
		mvc.perform(post("/api/sidework").cookie(alice).with(csrf()).contentType(MediaType.APPLICATION_JSON)
				.content("""
						{"date":"2026-11-03","startTime":"18:00","endTime":"08:00","workAnywhere":1}"""))
				.andExpect(status().isBadRequest());
		mvc.perform(post("/api/sidework").cookie(alice).with(csrf()).contentType(MediaType.APPLICATION_JSON)
				.content("""
						{"date":"2026-11-03","startTime":"08:00","endTime":"17:00","workAnywhere":9}"""))
				.andExpect(status().isBadRequest());
	}

	@Test
	void overtimeSavesEveryRangeAndIsOwnerOnly() throws Exception {
		Cookie alice = login("C0002");
		Cookie bob = login("C0003");
		MvcResult created = mvc.perform(post("/api/overtime").cookie(alice).with(csrf())
				.contentType(MediaType.APPLICATION_JSON).content("""
						{"projectNo":"P01","remark":"go-live","timeRange":[
						  {"startTime":"2026-11-07T09:00","endTime":"2026-11-07T12:00"},
						  {"startTime":"2026-11-08T09:00","endTime":"2026-11-08T12:00"}]}"""))
				.andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(2)).andReturn();
		int id = JsonPath.read(created.getResponse().getContentAsString(), "$[0].id");

		mvc.perform(delete("/api/overtime/" + id).cookie(bob).with(csrf())).andExpect(status().isNotFound());
		mvc.perform(get("/api/overtime").cookie(alice)).andExpect(jsonPath("$.length()").value(2));
		mvc.perform(delete("/api/overtime/" + id).cookie(alice).with(csrf())).andExpect(status().isNoContent());
	}

	@Test
	void reportsAreAdminOnly() throws Exception {
		Cookie alice = login("C0002");
		Cookie admin = login("C0001");
		mvc.perform(post("/api/sidework").cookie(alice).with(csrf()).contentType(MediaType.APPLICATION_JSON)
				.content("""
						{"date":"2026-10-05","startTime":"08:30","endTime":"17:30","workAnywhere":1}"""))
				.andExpect(status().isOk());

		mvc.perform(get("/api/admin/reports/worktime").param("year", "2026").param("month", "10").cookie(alice))
				.andExpect(status().isForbidden());

		mvc.perform(get("/api/admin/reports/time-attendance").param("year", "2026").param("month", "10")
				.cookie(admin)).andExpect(status().isOk())
				.andExpect(header().string("Content-Disposition",
						org.hamcrest.Matchers.containsString("add-workanywhere-202610.dat")))
				.andExpect(content().string("90002\t2026-10-05 08:30:00\n90002\t2026-10-05 17:30:00\n"));

		MvcResult xlsx = mvc.perform(get("/api/admin/reports/worktime").param("year", "2026").param("month", "10")
				.cookie(admin)).andExpect(status().isOk()).andReturn();
		assertThat(xlsx.getResponse().getContentAsByteArray()).startsWith('P', 'K');

		mvc.perform(get("/api/admin/reports/leave").param("year", "2026").param("month", "10").cookie(admin))
				.andExpect(status().isOk());
		mvc.perform(get("/api/admin/reports/leave").param("year", "2026").param("month", "13").cookie(admin))
				.andExpect(status().isBadRequest());
	}

	@Test
	void holidaysUseTheLoggedInEmployeeOnly() throws Exception {
		when(isService.getHolidays(eq("C0002"), any(), any()))
				.thenReturn(List.of(new IsServiceClient.Holiday("New Year", LocalDate.of(2026, 1, 1))));
		mvc.perform(get("/api/holidays").param("year", "2026").cookie(login("C0002")))
				.andExpect(status().isOk()).andExpect(jsonPath("$[0].title").value("New Year"))
				.andExpect(jsonPath("$[0].date").value("2026-01-01"));
	}

	private Cookie login(String employeeNo) throws Exception {
		MvcResult result = mvc.perform(post("/api/auth/login").with(csrf()).contentType(MediaType.APPLICATION_JSON)
				.content(loginJson(employeeNo, PASSWORD))).andExpect(status().isOk()).andReturn();
		Cookie cookie = result.getResponse().getCookie("WT_SESSION");
		assertThat(cookie).isNotNull();
		return new Cookie("WT_SESSION", cookie.getValue());
	}

	private static String loginJson(String employeeNo, String password) {
		return "{\"employeeNo\":\"" + employeeNo + "\",\"password\":\"" + password + "\"}";
	}
}
