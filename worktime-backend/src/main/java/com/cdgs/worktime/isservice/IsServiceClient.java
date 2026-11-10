package com.cdgs.worktime.isservice;

import java.io.ByteArrayInputStream;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.cdgs.worktime.config.IsServiceProperties;

/**
 * Minimal SOAP 1.1 client for the CDG IS web service (replaces the old Apache Axis 1.4 stubs).
 * Only the three operations this application needs are implemented.
 */
@Component
public class IsServiceClient {

	static final String NS = "http://tempuri.org/ISWebService/ISService";
	private static final String SOAP_NS = "http://schemas.xmlsoap.org/soap/envelope/";

	private final IsServiceProperties properties;
	private final HttpClient http;

	public IsServiceClient(IsServiceProperties properties) {
		this.properties = properties;
		this.http = HttpClient.newBuilder().connectTimeout(properties.timeout())
				.followRedirects(HttpClient.Redirect.NEVER).build();
	}

	public record Holiday(String name, LocalDate date) {
	}

	public record Leave(String title, LocalDate date, String type) {
	}

	/** @return true when the IS service accepts the employee number and password. */
	public boolean checkUserAuthentication(String employeeNo, String password) {
		Document doc = call("CheckUserAuthentication", params("UserID", employeeNo, "Password", password));
		NodeList result = doc.getElementsByTagNameNS(NS, "CheckUserAuthenticationResult");
		return result.getLength() > 0 && "true".equalsIgnoreCase(result.item(0).getTextContent().trim());
	}

	public List<Holiday> getHolidays(String employeeNo, LocalDate start, LocalDate end) {
		Document doc = call("GetHoliday",
				params("UserID", employeeNo, "StartDate", start.toString(), "EndDate", end.toString()));
		List<Holiday> holidays = new ArrayList<>();
		for (Element e : children(doc, "Holiday")) {
			LocalDate date = parseDate(text(e, "HolidayDate"));
			if (date != null) {
				holidays.add(new Holiday(text(e, "HolidayEngName"), date));
			}
		}
		return holidays;
	}

	public List<Leave> getLeaves(String employeeNo, LocalDate start, LocalDate end) {
		Document doc = call("GetLeave",
				params("UserID", employeeNo, "StartDate", start.toString(), "EndDate", end.toString()));
		List<Leave> leaves = new ArrayList<>();
		for (Element e : children(doc, "LeaveInformation")) {
			// <LeaveInformation> items also contain a <LeaveInformation> text field; only take the item elements
			if (e.getElementsByTagNameNS(NS, "LeaveDate").getLength() == 0) {
				continue;
			}
			LocalDate date = parseDate(text(e, "LeaveDate"));
			if (date != null) {
				leaves.add(new Leave(text(e, "LeaveInformation"), date, text(e, "LeaveType")));
			}
		}
		return leaves;
	}

	// ---------------------------------------------------------------------------------------------

	private Document call(String operation, Map<String, String> parameters) {
		StringBuilder body = new StringBuilder(256)
				.append("<?xml version=\"1.0\" encoding=\"utf-8\"?>")
				.append("<soap:Envelope xmlns:soap=\"").append(SOAP_NS).append("\"><soap:Body>")
				.append('<').append(operation).append(" xmlns=\"").append(NS).append("\">");
		parameters.forEach((name, value) -> body.append('<').append(name).append('>')
				.append(escapeXml(value)).append("</").append(name).append('>'));
		body.append("</").append(operation).append("></soap:Body></soap:Envelope>");

		HttpRequest request = HttpRequest.newBuilder(properties.url()).timeout(properties.timeout())
				.header("Content-Type", "text/xml; charset=utf-8")
				.header("SOAPAction", "\"" + NS + "/" + operation + "\"")
				.POST(HttpRequest.BodyPublishers.ofString(body.toString(), StandardCharsets.UTF_8)).build();
		try {
			HttpResponse<byte[]> response = http.send(request, HttpResponse.BodyHandlers.ofByteArray());
			if (response.statusCode() != 200) {
				throw new IsServiceException(operation + " returned HTTP " + response.statusCode());
			}
			return parse(response.body());
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
			throw new IsServiceException(operation + " interrupted", e);
		} catch (IsServiceException e) {
			throw e;
		} catch (Exception e) {
			throw new IsServiceException(operation + " failed: " + e.getClass().getSimpleName(), e);
		}
	}

	/** Parses XML with DTDs and external entities disabled (prevents XXE). */
	static Document parse(byte[] xml) throws Exception {
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		factory.setNamespaceAware(true);
		factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
		factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
		factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
		factory.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
		factory.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, "");
		factory.setAttribute(XMLConstants.ACCESS_EXTERNAL_SCHEMA, "");
		factory.setXIncludeAware(false);
		factory.setExpandEntityReferences(false);
		DocumentBuilder builder = factory.newDocumentBuilder();
		return builder.parse(new ByteArrayInputStream(xml));
	}

	private static List<Element> children(Document doc, String localName) {
		NodeList nodes = doc.getElementsByTagNameNS(NS, localName);
		List<Element> result = new ArrayList<>(nodes.getLength());
		for (int i = 0; i < nodes.getLength(); i++) {
			if (nodes.item(i).getNodeType() == Node.ELEMENT_NODE) {
				result.add((Element) nodes.item(i));
			}
		}
		return result;
	}

	private static String text(Element parent, String localName) {
		for (Node n = parent.getFirstChild(); n != null; n = n.getNextSibling()) {
			if (n.getNodeType() == Node.ELEMENT_NODE && localName.equals(n.getLocalName())) {
				return n.getTextContent().trim();
			}
		}
		return "";
	}

	private static LocalDate parseDate(String value) {
		if (value == null || value.length() < 10) {
			return null;
		}
		try {
			return LocalDate.parse(value.substring(0, 10));
		} catch (DateTimeParseException e) {
			return null;
		}
	}

	private static Map<String, String> params(String... keyValues) {
		Map<String, String> map = new LinkedHashMap<>();
		for (int i = 0; i < keyValues.length; i += 2) {
			map.put(keyValues[i], keyValues[i + 1] == null ? "" : keyValues[i + 1]);
		}
		return map;
	}

	static String escapeXml(String value) {
		StringBuilder sb = new StringBuilder(value.length());
		for (char c : value.toCharArray()) {
			switch (c) {
			case '<' -> sb.append("&lt;");
			case '>' -> sb.append("&gt;");
			case '&' -> sb.append("&amp;");
			case '"' -> sb.append("&quot;");
			case '\'' -> sb.append("&apos;");
			default -> {
				if (c >= 0x20 || c == '\t' || c == '\n' || c == '\r') {
					sb.append(c);
				}
			}
			}
		}
		return sb.toString();
	}
}
