import { Component, computed, inject, signal } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  CalendarOptions,
  DateClickInfo,
  DatesSetInfo,
  EventClickInfo,
  FullCalendarModule,
} from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/angular/daygrid';
import interactionPlugin from '@fullcalendar/angular/interaction';
import thLocale from 'fullcalendar/locales/th';
import themePlugin from '@fullcalendar/angular/themes/classic';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';
import { Holiday, Leave, ReportKind, Sidework } from '../../core/api/models';
import { ReportService } from '../../core/api/report.service';
import { CalendarDataService, SideworkService } from '../../core/api/worktime-api.service';
import { AuthService } from '../../core/auth/auth.service';
import {
  EVENT_COLORS,
  holidayEvent,
  leaveEvent,
  sideworkEvent,
} from '../../core/calendar/calendar-events';
import { isWeekend } from '../../core/util/date-utils';
import { WorkDialogs } from '../../dialogs/work-dialogs.service';
import { weekendHeaderClass, todayCellClass } from '../calendar-classes';

@Component({
  selector: 'app-sidework-calendar',
  imports: [FullCalendarModule, MatTooltipModule, MatButtonModule, MatIconModule],
  templateUrl: './sidework-calendar.html',
  styleUrl: './sidework-calendar.scss',
})
export class SideworkCalendar {
  private readonly sideworkApi = inject(SideworkService);
  private readonly calendarApi = inject(CalendarDataService);
  private readonly reports = inject(ReportService);
  private readonly dialogs = inject(WorkDialogs);
  protected readonly auth = inject(AuthService);

  private readonly sideworks = signal<Sidework[]>([]);
  private readonly holidays = signal<Holiday[]>([]);
  private readonly leaves = signal<Leave[]>([]);
  private loadedYear: number | null = null;
  /** First day of the month currently shown (used by the report buttons). */
  private readonly shownMonth = signal(new Date());

  protected readonly events = computed(() => [
    ...this.sideworks().map(sideworkEvent),
    ...this.holidays().map(holidayEvent),
    ...this.leaves().map(leaveEvent),
  ]);

  protected readonly legend = [
    { label: 'WFH', color: EVENT_COLORS.wfh },
    { label: 'Site', color: EVENT_COLORS.site },
    { label: 'Other', color: EVENT_COLORS.other },
    { label: 'ลืมบัตร', color: EVENT_COLORS.forgotCard },
    { label: 'วันหยุด', color: EVENT_COLORS.holiday },
    { label: 'วันลา', color: EVENT_COLORS.leave },
  ];

  protected readonly options: CalendarOptions = {
    plugins: [themePlugin, dayGridPlugin, interactionPlugin],
    locale: thLocale,
    firstDay: 0,
    initialView: 'dayGridMonth',
    showNonCurrentDates: false,
    aspectRatio: 2.3,
    displayEventTime: false,
    headerToolbar: { left: 'today', center: 'title', right: 'prev,next' },
    dayHeaderClass: weekendHeaderClass,
    dayCellClass: todayCellClass,
    dateClick: (info) => this.onDateClick(info),
    eventClick: (info) => this.onEventClick(info),
    datesSet: (info) => this.onDatesSet(info),
  };

  constructor() {
    this.loadSidework();
  }

  private loadSidework(): void {
    this.sideworkApi.list().subscribe((list) => this.sideworks.set(list));
  }

  private onDatesSet(info: DatesSetInfo): void {
    const shown = info.view.currentStart;
    this.shownMonth.set(shown);
    const year = shown.getFullYear();
    if (year !== this.loadedYear) {
      this.loadedYear = year;
      forkJoin([this.calendarApi.holidays(year), this.calendarApi.leaves(year)]).subscribe(
        ([holidays, leaves]) => {
          this.holidays.set(holidays);
          this.leaves.set(leaves);
        },
      );
    }
  }

  private onDateClick(info: DateClickInfo): void {
    // Saturdays and Sundays cannot be recorded (same as v1).
    if (isWeekend(info.date)) {
      return;
    }
    const dialog$ = this.auth.isAdmin()
      ? this.dialogs.employeesByDay(info.date, true)
      : this.dialogs.addSidework(info.date);
    dialog$.subscribe((changed) => changed && this.loadSidework());
  }

  private onEventClick(info: EventClickInfo): void {
    if (info.event.extendedProps['kind'] !== 'sidework') {
      return;
    }
    const item = this.sideworks().find((s) => String(s.id) === info.event.id);
    if (item) {
      this.dialogs
        .editSidework(item, this.auth.isAdmin())
        .subscribe((changed) => changed && this.loadSidework());
    }
  }

  protected download(kind: ReportKind): void {
    const shown = this.shownMonth();
    this.reports.download(kind, shown.getFullYear(), shown.getMonth() + 1);
  }
}
