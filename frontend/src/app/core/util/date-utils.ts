/**
 * Small date helpers that replace moment.js.
 * All values are local (Asia/Bangkok) wall-clock values, matching the API format.
 */

const pad = (n: number): string => String(n).padStart(2, '0');

/** Date -> `yyyy-MM-dd`. */
export function toIsoDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Date -> `HH:mm`. */
export function toIsoTime(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Date -> `yyyy-MM-ddTHH:mm`. */
export function toIsoDateTime(d: Date): string {
  return `${toIsoDate(d)}T${toIsoTime(d)}`;
}

/** `yyyy-MM-dd` -> local Date at midnight (`new Date('yyyy-MM-dd')` would be UTC). */
export function parseIsoDate(value: string): Date {
  const [y, m, d] = value.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** `yyyy-MM-ddTHH:mm[:ss]` -> local Date. */
export function parseIsoDateTime(value: string): Date {
  const date = parseIsoDate(value);
  const [h = 0, min = 0, s = 0] = (value.split('T')[1] ?? '').split(':').map(Number);
  date.setHours(h, min, s, 0);
  return date;
}

/** `HH:mm` on the given day (today by default) -> Date. */
export function timeToDate(time: string, day: Date = new Date()): Date {
  const [h, m] = time.split(':').map(Number);
  const d = new Date(day);
  d.setHours(h, m, 0, 0);
  return d;
}

/** Combine the calendar day of `day` with the clock time of `time`. */
export function combineDateAndTime(day: Date, time: Date): Date {
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), time.getHours(), time.getMinutes());
}

/**
 * Buddhist-era (พ.ศ.) formatting uses the real Buddhist calendar of Intl
 * (`-u-ca-buddhist`); the year is never converted by arithmetic.
 */
const buddhistFormatter = new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
  numberingSystem: 'latn',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

function buddhistParts(d: Date): Record<string, string> {
  const parts: Record<string, string> = {};
  for (const p of buddhistFormatter.formatToParts(d)) {
    parts[p.type] = p.value;
  }
  return parts;
}

/** Buddhist-era year (e.g. `2569`) of the given Gregorian year, via the Buddhist calendar. */
export function buddhistYear(gregorianYear: number): string {
  // Mid-year date avoids any boundary effects of the Buddhist new year.
  return buddhistParts(new Date(gregorianYear, 6, 1))['year'];
}

/** `yyyy-MM-dd` -> `dd/MM/yyyy` in the Buddhist era, like the old UI. */
export function formatThaiDate(isoDate: string): string {
  const d = parseIsoDate(isoDate);
  const p = buddhistParts(d);
  return `${p['day']}/${p['month']}/${p['year']}`;
}

/** `yyyy-MM-ddTHH:mm` -> `dd/MM/yyyy HH:mm` in the Buddhist era. */
export function formatThaiDateTime(isoDateTime: string): string {
  const d = parseIsoDateTime(isoDateTime);
  return `${formatThaiDate(toIsoDate(d))} ${toIsoTime(d)}`;
}

/** Extract `HH:mm` from `yyyy-MM-ddTHH:mm[:ss]`. */
export function timePart(isoDateTime: string): string {
  return (isoDateTime.split('T')[1] ?? '').slice(0, 5);
}

export function isWeekend(d: Date): boolean {
  return d.getDay() === 0 || d.getDay() === 6;
}
