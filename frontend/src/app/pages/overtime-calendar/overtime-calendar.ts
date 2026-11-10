import { Component, computed, inject, signal } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CalendarOptions, EventClickInfo, FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/angular/daygrid';
import interactionPlugin from '@fullcalendar/angular/interaction';
import thLocale from 'fullcalendar/locales/th';
import themePlugin from '@fullcalendar/angular/themes/classic';
import { Overtime } from '../../core/api/models';
import { OvertimeService } from '../../core/api/worktime-api.service';
import { overtimeEvent } from '../../core/calendar/calendar-events';
import { WorkDialogs } from '../../dialogs/work-dialogs.service';
import { todayCellClass, weekendHeaderClass } from '../calendar-classes';

@Component({
  selector: 'app-overtime-calendar',
  imports: [FullCalendarModule, MatTooltipModule],
  template: `
    <div class="page animation-page">
      <h1 class="page-title">ปฏิทินการลงเวลาทำงานล่วงเวลา</h1>
      <div class="calendar">
        <full-calendar [options]="options" [events]="events()">
          <ng-template #eventContent let-arg>
            <div class="wt-event" [matTooltip]="arg.event.extendedProps.tooltip" matTooltipClass="tooltip-primary">
              {{ arg.event.title }}
            </div>
          </ng-template>
        </full-calendar>
      </div>
    </div>
  `,
  styles: `
    .page {
      padding: 0 16px 40px;
    }
    .page-title {
      color: #333377;
      font-size: 2.2em;
      text-align: center;
      font-weight: normal;
    }
    .calendar {
      width: 83%;
      margin: 0 auto;
      background-color: whitesmoke;
    }
    @media screen and (max-width: 768px) {
      .calendar {
        width: 100%;
      }
    }
  `,
})
export class OvertimeCalendar {
  private readonly api = inject(OvertimeService);
  private readonly dialogs = inject(WorkDialogs);

  private readonly overtimes = signal<Overtime[]>([]);
  protected readonly events = computed(() => this.overtimes().map(overtimeEvent));

  protected readonly options: CalendarOptions = {
    plugins: [themePlugin, dayGridPlugin, interactionPlugin],
    locale: thLocale,
    firstDay: 0,
    initialView: 'dayGridMonth',
    showNonCurrentDates: false,
    aspectRatio: 2.2,
    displayEventTime: false,
    // Timed events as coloured blocks (v4 look) instead of v7's default "dot" list items.
    eventDisplay: 'block',
    selectable: true,
    headerToolbar: { left: 'dayGridMonth,dayGridWeek,dayGridDay', center: 'title', right: 'today prev,next' },
    dayHeaderClass: weekendHeaderClass,
    dayCellClass: todayCellClass,
    dateClick: (info) => this.dialogs.addOvertime(info.date).subscribe((changed) => changed && this.load()),
    eventClick: (info) => this.onEventClick(info),
  };

  constructor() {
    this.load();
  }

  private load(): void {
    this.api.list().subscribe((list) => this.overtimes.set(list));
  }

  private onEventClick(info: EventClickInfo): void {
    const item = this.overtimes().find((o) => String(o.id) === info.event.id);
    if (item) {
      this.dialogs.editOvertime(item).subscribe((changed) => changed && this.load());
    }
  }
}
