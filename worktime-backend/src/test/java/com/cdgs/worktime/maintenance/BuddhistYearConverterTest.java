package com.cdgs.worktime.maintenance;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;

class BuddhistYearConverterTest {

	@Test
	void convertsBuddhistDate() {
		assertThat(BuddhistYearConverter.convert(LocalDate.of(2563, 3, 31))).isEqualTo(LocalDate.of(2020, 3, 31));
	}

	@Test
	void buddhistLeapDayIsValid() {
		assertThat(BuddhistYearConverter.convert(2567, 2, 29)).isEqualTo(LocalDate.of(2024, 2, 29));
	}

	@Test
	void keepsTimeOfDay() {
		assertThat(BuddhistYearConverter.convert(LocalDateTime.of(2563, 3, 31, 8, 5, 9)))
				.isEqualTo(LocalDateTime.of(2020, 3, 31, 8, 5, 9));
	}

	@Test
	void doubleShiftedConvertsInTwoPasses() {
		assertThat(BuddhistYearConverter.convert(LocalDateTime.of(3106, 3, 24, 15, 26)))
				.isEqualTo(LocalDateTime.of(2020, 3, 24, 15, 26));
	}

	@Test
	void gregorianUnchanged() {
		assertThat(BuddhistYearConverter.convert(LocalDate.of(2026, 11, 10))).isEqualTo(LocalDate.of(2026, 11, 10));
		assertThat(BuddhistYearConverter.convert(LocalDateTime.of(2026, 11, 10, 1, 2)))
				.isEqualTo(LocalDateTime.of(2026, 11, 10, 1, 2));
	}

	@Test
	void nonexistentBuddhistDateIsRejected() {
		// 2580 is an ISO leap year but not a Buddhist-calendar leap year (BE 2580 = CE 2037)
		assertThatThrownBy(() -> BuddhistYearConverter.convert(LocalDate.of(2580, 2, 29)))
				.isInstanceOf(DateTimeException.class);
	}
}
