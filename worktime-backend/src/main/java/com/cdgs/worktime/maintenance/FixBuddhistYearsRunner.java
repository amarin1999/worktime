package com.cdgs.worktime.maintenance;

import java.util.List;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

/**
 * One-off command: {@code --app.maintenance.fix-buddhist-years=report|apply}. Prints the result and exits the JVM
 * (code 0, or 1 on error) - the application never starts serving.
 */
@Component
@ConditionalOnProperty(name = FixBuddhistYearsRunner.PROPERTY)
public class FixBuddhistYearsRunner implements ApplicationRunner {

	public static final String PROPERTY = "app.maintenance.fix-buddhist-years";

	private final MaintenanceService service;
	private final Environment env;

	public FixBuddhistYearsRunner(MaintenanceService service, Environment env) {
		this.service = service;
		this.env = env;
	}

	@Override
	public void run(ApplicationArguments args) {
		int code = 0;
		try {
			String mode = env.getProperty(PROPERTY, "");
			if (!mode.equals("report") && !mode.equals("apply")) {
				throw new IllegalArgumentException(PROPERTY + " must be 'report' or 'apply', got '" + mode + "'");
			}
			boolean apply = mode.equals("apply");
			System.out.println("== fix-buddhist-years (" + mode + ") ==");
			List<MaintenanceService.ColumnResult> results = service.fixBuddhistYears(apply);
			for (MaintenanceService.ColumnResult r : results) {
				System.out.println(r.column() + ": " + r.count() + " BE-looking row(s)"
						+ (apply ? ", " + r.updated() + " updated" : ""));
				r.examples().forEach(e -> System.out.println("    " + e));
				r.invalid().forEach(i -> System.out.println("    INVALID (skipped): " + i));
			}
			System.out.println(apply ? "== applied in one transaction ==" : "== report only, nothing changed ==");
		} catch (Exception e) {
			System.err.println("fix-buddhist-years failed: " + e.getMessage());
			code = 1;
		}
		System.out.flush();
		System.exit(code);
	}
}
