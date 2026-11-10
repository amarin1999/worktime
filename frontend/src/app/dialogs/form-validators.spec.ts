import { FormControl, FormGroup } from '@angular/forms';
import { WorkAnywhere } from '../core/api/models';
import { timeToDate } from '../core/util/date-utils';
import { rangeValidator } from './overtime/overtime-dialog';
import { sideworkFormValidator } from './sidework/sidework-dialog';

function sideworkForm(start: string, end: string, workAnywhere: WorkAnywhere, remark: string | null) {
  return new FormGroup(
    {
      date: new FormControl<Date | null>(new Date()),
      startTime: new FormControl<Date | null>(timeToDate(start)),
      endTime: new FormControl<Date | null>(timeToDate(end)),
      workAnywhere: new FormControl<WorkAnywhere>(workAnywhere, { nonNullable: true }),
      remark: new FormControl<string | null>(remark),
    },
    { validators: sideworkFormValidator },
  );
}

describe('sidework form rules', () => {
  it('accepts a normal WFH day without remark', () => {
    expect(sideworkForm('08:00', '17:00', 1, null).errors).toBeNull();
  });

  it('requires the end time to be after the start time', () => {
    expect(sideworkForm('17:00', '08:00', 1, null).hasError('wrongTime')).toBe(true);
    expect(sideworkForm('08:00', '08:00', 1, null).hasError('wrongTime')).toBe(true);
  });

  it('requires a remark for Site and Other only', () => {
    expect(sideworkForm('08:00', '17:00', 2, '  ').hasError('remarkRequired')).toBe(true);
    expect(sideworkForm('08:00', '17:00', 3, null).hasError('remarkRequired')).toBe(true);
    expect(sideworkForm('08:00', '17:00', 3, 'ลูกค้า').errors).toBeNull();
    expect(sideworkForm('08:00', '17:00', 4, null).errors).toBeNull();
  });
});

describe('overtime range rules', () => {
  const range = (startDate: Date, start: string, endDate: Date, end: string) =>
    new FormGroup(
      {
        startDate: new FormControl<Date | null>(startDate),
        startTime: new FormControl<Date | null>(timeToDate(start)),
        endDate: new FormControl<Date | null>(endDate),
        endTime: new FormControl<Date | null>(timeToDate(end)),
      },
      { validators: rangeValidator },
    );
  const day = new Date(2026, 0, 5);
  const nextDay = new Date(2026, 0, 6);

  it('accepts an evening range and an overnight range', () => {
    expect(range(day, '18:00', day, '21:00').errors).toBeNull();
    expect(range(day, '22:00', nextDay, '02:00').errors).toBeNull();
  });

  it('rejects an end before the start', () => {
    expect(range(day, '22:00', day, '02:00').hasError('wrongTime')).toBe(true);
  });

  it('rejects future overtime', () => {
    const future = new Date();
    future.setDate(future.getDate() + 2);
    expect(range(future, '18:00', future, '20:00').hasError('future')).toBe(true);
  });
});
