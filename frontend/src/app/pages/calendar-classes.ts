import { DayCellInfo, DayHeaderInfo } from '@fullcalendar/angular';

/** Highlights the Saturday/Sunday column headers (styled in styles.scss). */
export function weekendHeaderClass(info: DayHeaderInfo): string {
  return info.dow === 0 || info.dow === 6 ? 'wt-weekend-header' : '';
}

/** Marks today's cell (styled in styles.scss). */
export function todayCellClass(info: DayCellInfo): string {
  return info.isToday ? 'wt-today' : '';
}
