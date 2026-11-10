import { Overtime, Sidework } from '../api/models';
import {
  EVENT_COLORS,
  holidayEvent,
  leaveEvent,
  overtimeTitle,
  sideworkEvent,
  sideworkTitle,
  workAnywhereLabel,
} from './calendar-events';

const sidework = (patch: Partial<Sidework> = {}): Sidework => ({
  id: 7,
  date: '2026-11-09',
  startTime: '08:30',
  endTime: '17:30',
  workAnywhere: 1,
  remark: null,
  lastUpdate: '2026-11-09T18:00:00',
  ...patch,
});

describe('calendar event builders', () => {
  it('builds the v1 sidework title (WFH with remark)', () => {
    expect(sideworkTitle(sidework({ remark: 'ประชุมลูกค้า' }))).toBe(
      '08:30 ถึง  17:30\nWork Anywhere (WFH)\nหมายเหตุ : ประชุมลูกค้า',
    );
  });

  it('pads the title with blank lines when there is no remark (as v1 did)', () => {
    expect(sideworkTitle(sidework({ workAnywhere: 2 }))).toBe('08:30 ถึง  17:30\nWork Anywhere (Site)\n\n');
    expect(sideworkTitle(sidework({ workAnywhere: 3, remark: '' }))).toBe(
      '08:30 ถึง  17:30\nWork Anywhere (Other)\n\n',
    );
  });

  it('uses the forgot-card line for workAnywhere 4 and tolerates a missing end time', () => {
    expect(sideworkTitle(sidework({ workAnywhere: 4, endTime: null }))).toBe('08:30 ถึง  -\n ลืมบัตรพนักงาน\n\n');
  });

  it('builds the overtime title from date-times', () => {
    const ot: Overtime = {
      id: 1,
      projectNo: 'P-001',
      startTime: '2026-11-09T18:00',
      endTime: '2026-11-09T21:30',
      remark: null,
      lastUpdate: '2026-11-09T22:00:00',
    };
    expect(overtimeTitle(ot)).toBe('รหัสโครงการ : P-001\nเวลา : 18:00 ถึง  21:30');
  });

  it('colours events like the old calendar', () => {
    expect(sideworkEvent(sidework({ workAnywhere: 2 })).color).toBe(EVENT_COLORS.site);
    expect(sideworkEvent(sidework({ workAnywhere: 4 })).color).toBe(EVENT_COLORS.forgotCard);
    expect(holidayEvent({ title: 'วันปิยมหาราช', date: '2026-10-23' }).color).toBe(EVENT_COLORS.holiday);
    expect(leaveEvent({ title: 'ลาพักร้อน', date: '2026-11-10', type: 'V' }).color).toBe(EVENT_COLORS.leave);
  });

  it('marks the event kind and tooltip text', () => {
    const e = sideworkEvent(sidework());
    expect(e.id).toBe('7');
    expect(e.start).toBe('2026-11-09');
    expect(e.allDay).toBe(true);
    expect(e.extendedProps).toEqual({ kind: 'sidework', tooltip: 'หมายเหตุ: ไม่มี' });
  });

  it('maps workAnywhere codes to labels', () => {
    expect([1, 2, 3, 4, 9].map(workAnywhereLabel)).toEqual(['WFH', 'Site', 'Other', 'ลืมบัตร', '']);
  });
});
