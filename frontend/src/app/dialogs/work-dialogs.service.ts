import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, of, switchMap, tap } from 'rxjs';
import { Overtime, Sidework } from '../core/api/models';
import { NotifyService } from '../core/notify.service';
import {
  EmployeesByDayDialog,
  EmployeesByDayDialogData,
  EmployeesByDayDialogResult,
} from './employees-by-day/employees-by-day-dialog';
import { OvertimeDialog, OvertimeDialogData, OvertimeDialogResult } from './overtime/overtime-dialog';
import { SideworkDialog, SideworkDialogData, SideworkDialogResult } from './sidework/sidework-dialog';

const SUCCESS_TEXT = {
  saved: 'ลงเวลาเรียบร้อยแล้ว',
  updated: 'แก้ไขการลงเวลาเรียบร้อยแล้ว',
  deleted: 'ลบรายการลงเวลาเรียบร้อยแล้ว',
} as const;

const BASE_CONFIG: MatDialogConfig = { autoFocus: false, maxWidth: '95vw' };

/**
 * Opens the add/edit dialogs, shows the success toast and chains the
 * edit -> employee list -> add flows. Every method emits `true` when data changed.
 */
@Injectable({ providedIn: 'root' })
export class WorkDialogs {
  private readonly dialog = inject(MatDialog);
  private readonly notify = inject(NotifyService);

  addSidework(date: Date): Observable<boolean> {
    return this.openSidework({ mode: 'add', date });
  }

  editSidework(sidework: Sidework, showEmployeesButton: boolean): Observable<boolean> {
    return this.openSidework({ mode: 'edit', sidework, showEmployeesButton });
  }

  employeesByDay(date: Date, allowInsert: boolean): Observable<boolean> {
    return this.dialog
      .open<EmployeesByDayDialog, EmployeesByDayDialogData, EmployeesByDayDialogResult>(EmployeesByDayDialog, {
        ...BASE_CONFIG,
        data: { date, allowInsert },
      })
      .afterClosed()
      .pipe(switchMap((result) => (result?.action === 'insert' ? this.addSidework(result.date) : of(false))));
  }

  addOvertime(date: Date): Observable<boolean> {
    return this.openOvertime({ mode: 'add', date });
  }

  editOvertime(overtime: Overtime): Observable<boolean> {
    return this.openOvertime({ mode: 'edit', overtime });
  }

  private openSidework(data: SideworkDialogData): Observable<boolean> {
    return this.dialog
      .open<SideworkDialog, SideworkDialogData, SideworkDialogResult>(SideworkDialog, { ...BASE_CONFIG, data })
      .afterClosed()
      .pipe(
        switchMap((result) => {
          if (!result) {
            return of(false);
          }
          if (result.action === 'showEmployees') {
            return this.employeesByDay(result.date, false);
          }
          this.notify.success(SUCCESS_TEXT[result.action]);
          return of(true);
        }),
      );
  }

  private openOvertime(data: OvertimeDialogData): Observable<boolean> {
    return this.dialog
      .open<OvertimeDialog, OvertimeDialogData, OvertimeDialogResult>(OvertimeDialog, { ...BASE_CONFIG, data })
      .afterClosed()
      .pipe(
        tap((result) => result && this.notify.success(SUCCESS_TEXT[result.action])),
        switchMap((result) => of(!!result)),
      );
  }
}
