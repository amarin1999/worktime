package com.cdgs.worktime.maintenance;

import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.chrono.ThaiBuddhistDate;

/**
 * Converts values the legacy system stored with a Thai Buddhist-era (BE) year field into Gregorian (CE) dates.
 * The conversion is done by the calendar system ({@link ThaiBuddhistDate}), never by adding/subtracting years.
 */
public final class BuddhistYearConverter {

	/** A year greater than this is treated as a Buddhist-era year. */
	public static final int BUDDHIST_YEAR_THRESHOLD = 2400;

	private BuddhistYearConverter() {
	}

	public static boolean isBuddhist(LocalDate date) {
		return date != null && date.getYear() > BUDDHIST_YEAR_THRESHOLD;
	}

	public static boolean isBuddhist(LocalDateTime dateTime) {
		return dateTime != null && dateTime.getYear() > BUDDHIST_YEAR_THRESHOLD;
	}

	/**
	 * Interprets the fields as a BE date and converts repeatedly while the result is still BE-looking.
	 *
	 * @throws DateTimeException if the date does not exist in the Thai Buddhist calendar (e.g. BE leap-day mismatch)
	 */
	public static LocalDate convert(int year, int month, int day) {
		int y = year;
		int m = month;
		int d = day;
		LocalDate result;
		do {
			result = LocalDate.from(ThaiBuddhistDate.of(y, m, d));
			y = result.getYear();
			m = result.getMonthValue();
			d = result.getDayOfMonth();
		} while (y > BUDDHIST_YEAR_THRESHOLD);
		return result;
	}

	/** Returns the date unchanged when it is not BE-looking. */
	public static LocalDate convert(LocalDate date) {
		if (!isBuddhist(date)) {
			return date;
		}
		return convert(date.getYear(), date.getMonthValue(), date.getDayOfMonth());
	}

	/** Same as {@link #convert(LocalDate)} but keeps the time of day. */
	public static LocalDateTime convert(LocalDateTime dateTime) {
		if (!isBuddhist(dateTime)) {
			return dateTime;
		}
		return convert(dateTime.toLocalDate()).atTime(dateTime.toLocalTime());
	}
}
