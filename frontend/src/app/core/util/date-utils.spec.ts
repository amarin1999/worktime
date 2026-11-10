import {
  buddhistYear,
  combineDateAndTime,
  formatThaiDate,
  formatThaiDateTime,
  isWeekend,
  parseIsoDate,
  parseIsoDateTime,
  timePart,
  toIsoDate,
  toIsoDateTime,
  toIsoTime,
} from './date-utils';

describe('date-utils', () => {
  it('formats local dates and times in API format', () => {
    const d = new Date(2026, 0, 5, 7, 3);
    expect(toIsoDate(d)).toBe('2026-01-05');
    expect(toIsoTime(d)).toBe('07:03');
    expect(toIsoDateTime(d)).toBe('2026-01-05T07:03');
  });

  it('parses yyyy-MM-dd as a local date (not UTC)', () => {
    const d = parseIsoDate('2026-12-31');
    expect([d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()]).toEqual([2026, 11, 31, 0]);
  });

  it('parses date-times with or without seconds', () => {
    expect(toIsoDateTime(parseIsoDateTime('2026-03-01T18:45'))).toBe('2026-03-01T18:45');
    expect(parseIsoDateTime('2026-03-01T18:45:30').getSeconds()).toBe(30);
  });

  it('combines the day of one Date with the time of another', () => {
    expect(toIsoDateTime(combineDateAndTime(new Date(2026, 4, 2), new Date(1999, 0, 1, 22, 15)))).toBe(
      '2026-05-02T22:15',
    );
  });

  it('formats Buddhist-era dates like the old UI', () => {
    expect(formatThaiDate('2026-11-09')).toBe('09/11/2569');
    expect(formatThaiDateTime('2026-11-09T18:05')).toBe('09/11/2569 18:05');
    expect(timePart('2026-11-09T18:05:00')).toBe('18:05');
  });

  it('formats via the Buddhist calendar for key dates', () => {
    expect(formatThaiDate('2026-11-10')).toBe('10/11/2569');
    expect(formatThaiDate('2024-02-29')).toBe('29/02/2567');
    expect(formatThaiDateTime('2026-01-01T00:00')).toBe('01/01/2569 00:00');
  });

  it('gives the Buddhist year for a Gregorian year', () => {
    expect(buddhistYear(2026)).toBe('2569');
    expect(buddhistYear(2000)).toBe('2543');
  });

  it('detects weekends', () => {
    expect(isWeekend(new Date(2026, 10, 7))).toBe(true); // Saturday
    expect(isWeekend(new Date(2026, 10, 9))).toBe(false); // Monday
  });
});
