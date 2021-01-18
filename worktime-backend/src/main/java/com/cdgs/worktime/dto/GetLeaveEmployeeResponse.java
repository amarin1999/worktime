package com.cdgs.worktime.dto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class GetLeaveEmployeeResponse {

	@JsonProperty("result")
	private String result;
	@JsonProperty("stringData")
	private Object stringData;
	@JsonProperty("data")
	private List<GetLeaveEmployeeData> data = null;
	@JsonProperty("errorMessage")
	private Object errorMessage;
	@JsonProperty("code")
	private Integer code;
	@JsonIgnore
	private Map<String, Object> additionalProperties = new HashMap<String, Object>();

	@JsonProperty("result")
	public String getResult() {
		return result;
	}

	@JsonProperty("result")
	public void setResult(String result) {
		this.result = result;
	}

	@JsonProperty("stringData")
	public Object getStringData() {
		return stringData;
	}

	@JsonProperty("stringData")
	public void setStringData(Object stringData) {
		this.stringData = stringData;
	}

	@JsonProperty("data")
	public List<GetLeaveEmployeeData> getData() {
		return data;
	}

	@JsonProperty("data")
	public void setData(List<GetLeaveEmployeeData> data) {
		this.data = data;
	}

	@JsonProperty("errorMessage")
	public Object getErrorMessage() {
		return errorMessage;
	}

	@JsonProperty("errorMessage")
	public void setErrorMessage(Object errorMessage) {
		this.errorMessage = errorMessage;
	}

	@JsonProperty("code")
	public Integer getCode() {
		return code;
	}

	@JsonProperty("code")
	public void setCode(Integer code) {
		this.code = code;
	}

	@JsonAnyGetter
	public Map<String, Object> getAdditionalProperties() {
		return this.additionalProperties;
	}

	@JsonAnySetter
	public void setAdditionalProperty(String name, Object value) {
		this.additionalProperties.put(name, value);
	}

}
