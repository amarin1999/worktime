package com.cdgs.worktime.config;

import java.time.Clock;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** System clock (server time zone, expected Asia/Bangkok); replaceable in tests. */
@Configuration
public class ClockConfig {

	@Bean
	Clock clock() {
		return Clock.systemDefaultZone();
	}
}
