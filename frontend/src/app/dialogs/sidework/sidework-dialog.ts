import { Component, OnInit, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { filter, switchMap } from 'rxjs';
import { Sidework, SideworkRequest, WORK_ANYWHERE, WorkAnywhere } from '../../core/api/models';
import { SideworkService } from '../../core/api/worktime-api.service';
import {
  parseIsoDate,
  timeToDate,
  toIsoDate,
  toIsoTime,
} from '../../core/util/date-utils';
import { ThaiDatePipe } from '../../shared/pipes';
import { ConfirmDialog, ConfirmDialogData } from '../confirm/confirm-dialog';

export type SideworkDialogData =
  | { mode: 'add'; date: Date }
  | { mode: 'edit'; sidework: Sidework; showEmployeesButton: boolean };

export type SideworkDialogResult =
  | { action: 'saved' | 'updated' | 'deleted' }
  | { action: 'showEmployees'; date: Date };

export const REMARK_MAX_LENGTH = 250;

interface SideworkForm {
  date: FormControl<Date | null>;
  startTime: FormControl<Date | null>;
  endTime: FormControl<Date | null>;
  workAnywhere: FormControl<WorkAnywhere>;
  remark: FormControl<string | null>;
}

/** End time must be after start time; Site/Other need a remark (same rules as v1). */
export function sideworkFormValidator(group: AbstractControl): ValidationErrors | null {
  const { startTime, endTime, workAnywhere, remark } = (group as FormGroup<SideworkForm>).getRawValue();
  const errors: ValidationErrors = {};
  if (startTime && endTime && toIsoTime(endTime) <= toIsoTime(startTime)) {
    errors['wrongTime'] = true;
  }
  const needsRemark = workAnywhere === WORK_ANYWHERE.SITE || workAnywhere === WORK_ANYWHERE.OTHER;
  if (needsRemark && !remark?.trim()) {
    errors['remarkRequired'] = true;
  }
  return Object.keys(errors).length ? errors : null;
}

/** Add / edit / delete one work-anywhere record. */
@Component({
  selector: 'app-sidework-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatTimepickerModule,
    MatCheckboxModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    ThaiDatePipe,
  ],
  templateUrl: './sidework-dialog.html',
  styleUrl: '../dialog-form.scss',
})
export class SideworkDialog implements OnInit {
  private readonly api = inject(SideworkService);
  private readonly dialog = inject(MatDialog);
  private readonly dialogRef = inject<MatDialogRef<SideworkDialog, SideworkDialogResult>>(MatDialogRef);
  protected readonly data = inject<SideworkDialogData>(MAT_DIALOG_DATA);

  protected readonly WA = WORK_ANYWHERE;
  protected readonly remarkMax = REMARK_MAX_LENGTH;
  /** Set when a record already exists on the chosen date (POST will update it). */
  protected readonly alreadyRecorded = signal(false);

  protected readonly form = new FormGroup<SideworkForm>(
    {
      date: new FormControl<Date | null>(null, Validators.required),
      startTime: new FormControl<Date | null>(timeToDate('08:00'), Validators.required),
      endTime: new FormControl<Date | null>(timeToDate('17:00'), Validators.required),
      workAnywhere: new FormControl<WorkAnywhere>(WORK_ANYWHERE.WFH, { nonNullable: true }),
      remark: new FormControl<string | null>(null, Validators.maxLength(REMARK_MAX_LENGTH)),
    },
    { validators: sideworkFormValidator },
  );

  ngOnInit(): void {
    if (this.data.mode === 'add') {
      this.form.controls.date.setValue(this.data.date);
      this.checkDate(this.data.date);
    } else {
      const s = this.data.sidework;
      this.form.setValue({
        date: parseIsoDate(s.date),
        startTime: timeToDate(s.startTime),
        endTime: s.endTime ? timeToDate(s.endTime) : null,
        workAnywhere: s.workAnywhere,
        remark: s.remark,
      });
    }
  }

  protected get isForgotCard(): boolean {
    return this.form.controls.workAnywhere.value === WORK_ANYWHERE.FORGOT_CARD;
  }

  /** "Work Anywhere" and "ลืมบัตรพนักงาน" behave like two exclusive checkboxes (as in v1). */
  protected toggleKind(): void {
    this.form.controls.workAnywhere.setValue(this.isForgotCard ? WORK_ANYWHERE.WFH : WORK_ANYWHERE.FORGOT_CARD);
  }

  protected onDateChange(date: Date | null): void {
    if (date) {
      this.checkDate(date);
    }
  }

  private checkDate(date: Date): void {
    this.alreadyRecorded.set(false);
    this.api.byDate(toIsoDate(date)).subscribe({
      next: () => this.alreadyRecorded.set(true),
      error: () => this.alreadyRecorded.set(false),
    });
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const body: SideworkRequest = {
      date: toIsoDate(v.date as Date),
      startTime: toIsoTime(v.startTime as Date),
      endTime: toIsoTime(v.endTime as Date),
      workAnywhere: v.workAnywhere,
      remark: v.remark?.trim() ? v.remark.trim() : null,
    };
    if (this.data.mode === 'add') {
      this.api.save(body).subscribe(() => this.dialogRef.close({ action: 'saved' }));
    } else {
      this.api.update(this.data.sidework.id, body).subscribe(() => this.dialogRef.close({ action: 'updated' }));
    }
  }

  protected remove(): void {
    if (this.data.mode !== 'edit') {
      return;
    }
    const id = this.data.sidework.id;
    this.dialog
      .open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, {
        data: { textConfirm: 'ยืนยันการลบรายการ ?' },
        width: '370px',
        disableClose: true,
        autoFocus: false,
      })
      .afterClosed()
      .pipe(
        filter((ok) => ok === true),
        switchMap(() => this.api.delete(id)),
      )
      .subscribe(() => this.dialogRef.close({ action: 'deleted' }));
  }

  protected showEmployees(): void {
    if (this.data.mode === 'edit') {
      this.dialogRef.close({ action: 'showEmployees', date: parseIsoDate(this.data.sidework.date) });
    }
  }
}
