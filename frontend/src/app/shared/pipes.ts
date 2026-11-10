import { Pipe, PipeTransform } from '@angular/core';
import { workAnywhereLabel } from '../core/calendar/calendar-events';
import { formatThaiDate, formatThaiDateTime } from '../core/util/date-utils';

/** `yyyy-MM-dd` -> `dd/MM/yyyy` (Buddhist era). */
@Pipe({ name: 'thaiDate' })
export class ThaiDatePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    return value ? formatThaiDate(value) : '';
  }
}

/** `yyyy-MM-ddTHH:mm` -> `dd/MM/yyyy HH:mm` (Buddhist era). */
@Pipe({ name: 'thaiDateTime' })
export class ThaiDateTimePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    return value ? formatThaiDateTime(value) : '';
  }
}

/** 1-4 -> WFH / Site / Other / ลืมบัตร. */
@Pipe({ name: 'workAnywhere' })
export class WorkAnywherePipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    return workAnywhereLabel(value);
  }
}
