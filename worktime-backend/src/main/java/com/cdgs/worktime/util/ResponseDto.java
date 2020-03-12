package com.cdgs.worktime.util;

import java.util.List;

import com.cdgs.worktime.dto.EmployeeDto;
import com.cdgs.worktime.dto.SideworkHistoryDto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ResponseDto<T> {
	private String result;
	private String stringData;
	private List<T> data;
	private String errorMessage;
	private int code;

	public enum RESPONSE_RESULT {
		Success("Success"), Fail("Fail");

		private String res;

		private RESPONSE_RESULT(String res) {
			this.res = res;
		}

		public String getRes() {
			return this.res;
		}
	}

}
