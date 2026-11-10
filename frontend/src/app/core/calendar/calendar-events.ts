import { EventInput } from '@fullcalendar/angular';
import { Holiday, Leave, Overtime, Sidework, WorkAnywhere } from '../api/models';
import { timePart } from '../util/date-utils';

/** Short labels used in tables and filters. */
export const WORK_ANYWHERE_LABELS: Record<WorkAnywhere, string> = {
  1: 'WFH',
  2: 'Site',
  3: 'Other',
  4: 'ลืมบัตร',
};

export function workAnywhereLabel(value: number | null | undefined): string {
  return WORK_ANYWHERE_LABELS[value as WorkAnywhere] ?? '';
}

/** Colours of the old calendar (also used by the legend). */
export const EVENT_COLORS = {
  wfh: 'SteelBlue',
  site: 'SeaGreen',
  other: 'RebeccaPurple',
  forgotCard: 'Maroon',
  holiday: 'rgb(243, 127, 127)',
  leave: 'Orange',
} as const;

const SIDEWORK_COLORS: Record<WorkAnywhere, string> = {
  1: EVENT_COLORS.wfh,
  2: EVENT_COLORS.site,
  3: EVENT_COLORS.other,
  4: EVENT_COLORS.forgotCard,
};

const WORK_ANYWHERE_TITLE_LINES: Record<WorkAnywhere, string> = {
  1: '\nWork Anywhere (WFH)',
  2: '\nWork Anywhere (Site)',
  3: '\nWork Anywhere (Other)',
  4: '\n ลืมบัตรพนักงาน',
};

/**
 * Same text the v1 backend built in DataTableServiceImpl, e.g.
 * "08:30 ถึง  17:30\nWork Anywhere (WFH)\nหมายเหตุ : ...".
 */
export function sideworkTitle(s: Pick<Sidework, 'startTime' | 'endTime' | 'workAnywhere' | 'remark'>): string {
  const remark = s.remark ? `\nหมายเหตุ : ${s.remark}` : '\n\n';
  return `${s.startTime} ถึง  ${s.endTime ?? '-'}${WORK_ANYWHERE_TITLE_LINES[s.workAnywhere] ?? ''}${remark}`;
}

/** "รหัสโครงการ : P001\nเวลา : 18:00 ถึง  20:00" (same as v1). */
export function overtimeTitle(o: Pick<Overtime, 'projectNo' | 'startTime' | 'endTime'>): string {
  return `รหัสโครงการ : ${o.projectNo}\nเวลา : ${timePart(o.startTime)} ถึง  ${timePart(o.endTime)}`;
}

/** What kind of calendar entry an event is (stored in extendedProps). */
export type CalendarEntryKind = 'sidework' | 'overtime' | 'holiday' | 'leave';

export interface CalendarEntryProps {
  kind: CalendarEntryKind;
  /** Text for the hover tooltip. */
  tooltip: string;
}

function remarkTooltip(remark: string | null): string {
  return `หมายเหตุ: ${remark ? remark : 'ไม่มี'}`;
}

export function sideworkEvent(s: Sidework): EventInput {
  const props: CalendarEntryProps = { kind: 'sidework', tooltip: remarkTooltip(s.remark) };
  return {
    id: String(s.id),
    title: sideworkTitle(s),
    start: s.date,
    allDay: true,
    color: SIDEWORK_COLORS[s.workAnywhere] ?? EVENT_COLORS.wfh,
    contrastColor: 'Azure',
    extendedProps: props,
  };
}

export function overtimeEvent(o: Overtime): EventInput {
  const props: CalendarEntryProps = { kind: 'overtime', tooltip: remarkTooltip(o.remark) };
  return {
    id: String(o.id),
    title: overtimeTitle(o),
    start: o.startTime,
    end: o.endTime,
    allDay: false,
    extendedProps: props,
  };
}

export function holidayEvent(h: Holiday): EventInput {
  const props: CalendarEntryProps = { kind: 'holiday', tooltip: h.title };
  return {
    title: h.title,
    start: h.date,
    allDay: true,
    color: EVENT_COLORS.holiday,
    contrastColor: 'Black',
    extendedProps: props,
  };
}

export function leaveEvent(l: Leave): EventInput {
  const props: CalendarEntryProps = { kind: 'leave', tooltip: l.type ? `${l.title} (${l.type})` : l.title };
  return {
    title: l.title,
    start: l.date,
    allDay: true,
    color: EVENT_COLORS.leave,
    contrastColor: 'Black',
    extendedProps: props,
  };
}
