package com.cdgs.worktime;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class WorkTimeApplication {

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(WorkTimeApplication.class);
		// One-off maintenance command: run without the web server.
		for (String a : args) {
			if (a.startsWith("--app.maintenance.fix-buddhist-years")) {
				app.setWebApplicationType(WebApplicationType.NONE);
			}
		}
		app.run(args);
	}
}
