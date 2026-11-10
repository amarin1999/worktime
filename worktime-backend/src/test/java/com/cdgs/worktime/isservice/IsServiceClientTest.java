package com.cdgs.worktime.isservice;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDate;
import java.util.concurrent.atomic.AtomicReference;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.cdgs.worktime.config.IsServiceProperties;
import com.sun.net.httpserver.HttpServer;

class IsServiceClientTest {

	private HttpServer server;
	private final AtomicReference<String> lastRequest = new AtomicReference<>();
	private final AtomicReference<String> lastSoapAction = new AtomicReference<>();
	private volatile String responseBody = "";
	private IsServiceClient client;

	@BeforeEach
	void start() throws IOException {
		server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
		server.createContext("/isservice.asmx", exchange -> {
			lastRequest.set(new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8));
			lastSoapAction.set(exchange.getRequestHeaders().getFirst("SOAPAction"));
			byte[] bytes = responseBody.getBytes(StandardCharsets.UTF_8);
			exchange.sendResponseHeaders(200, bytes.length);
			exchange.getResponseBody().write(bytes);
			exchange.close();
		});
		server.start();
		client = new IsServiceClient(new IsServiceProperties(
				URI.create("http://127.0.0.1:" + server.getAddress().getPort() + "/isservice.asmx"),
				Duration.ofSeconds(5)));
	}

	@AfterEach
	void stop() {
		server.stop(0);
	}

	@Test
	void checkUserAuthenticationEscapesInputAndParsesResult() {
		responseBody = envelope("<CheckUserAuthenticationResponse xmlns=\"" + IsServiceClient.NS
				+ "\"><CheckUserAuthenticationResult>true</CheckUserAuthenticationResult></CheckUserAuthenticationResponse>");
		assertThat(client.checkUserAuthentication("C0001", "p<a&ss>")).isTrue();
		assertThat(lastRequest.get()).contains("<UserID>C0001</UserID>")
				.contains("<Password>p&lt;a&amp;ss&gt;</Password>");
		assertThat(lastSoapAction.get()).isEqualTo("\"" + IsServiceClient.NS + "/CheckUserAuthentication\"");

		responseBody = responseBody.replace(">true<", ">false<");
		assertThat(client.checkUserAuthentication("C0001", "x")).isFalse();
	}

	@Test
	void parsesHolidaysAndLeaves() {
		responseBody = envelope("<GetHolidayResponse xmlns=\"" + IsServiceClient.NS + "\"><GetHolidayResult>"
				+ "<Holiday><HolidayEngName>New Year</HolidayEngName><HolidayDate>2026-01-01</HolidayDate></Holiday>"
				+ "</GetHolidayResult></GetHolidayResponse>");
		assertThat(client.getHolidays("C0001", LocalDate.of(2026, 1, 1), LocalDate.of(2026, 12, 31)))
				.containsExactly(new IsServiceClient.Holiday("New Year", LocalDate.of(2026, 1, 1)));

		responseBody = envelope("<GetLeaveResponse xmlns=\"" + IsServiceClient.NS + "\"><GetLeaveResult>"
				+ "<LeaveInformation><EmpNo>C0001</EmpNo><LeaveDate>2026-02-03T00:00:00</LeaveDate>"
				+ "<LeaveInformation>ลาพักผ่อน</LeaveInformation><LeaveType>VACA</LeaveType></LeaveInformation>"
				+ "</GetLeaveResult></GetLeaveResponse>");
		assertThat(client.getLeaves("C0001", LocalDate.of(2026, 2, 1), LocalDate.of(2026, 2, 28)))
				.containsExactly(new IsServiceClient.Leave("ลาพักผ่อน", LocalDate.of(2026, 2, 3), "VACA"));
	}

	@Test
	void rejectsXmlExternalEntities() {
		responseBody = "<?xml version=\"1.0\"?><!DOCTYPE x [<!ENTITY xxe SYSTEM \"file:///c:/windows/win.ini\">]>"
				+ envelope("<CheckUserAuthenticationResult xmlns=\"" + IsServiceClient.NS
						+ "\">&xxe;</CheckUserAuthenticationResult>");
		assertThatThrownBy(() -> client.checkUserAuthentication("a", "b")).isInstanceOf(IsServiceException.class);
	}

	private static String envelope(String body) {
		return "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"><soap:Body>" + body
				+ "</soap:Body></soap:Envelope>";
	}
}
