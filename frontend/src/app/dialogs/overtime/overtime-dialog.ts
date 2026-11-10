import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { filter, switchMap } from 'rxjs';
import { Overtime } from '../../core/api/models';
import { OvertimeService } from '../../core/api/worktime-api.service';
import { combineDateAndTime, parseIsoDateTime, toIsoDateTime } from '../../core/util/date-utils';
import { ConfirmDialog, ConfirmDialogData } from '../confirm/confirm-dialog';
import { REMARK_MAX_LENGTH } from '../sidework/sidework-dialog';

export type OvertimeDialogData = { mode: 'add'; date: Date } | { mode: 'edit'; overtime: Overtime };
export interface OvertimeDialogResult {
  action: 'saved' | 'updated' | 'deleted';
}

/** One start/end pair; date and time are picked separately and combined on submit. */
interface RangeForm {
  startDate: FormControl<Date | null>;
  startTime: FormControl<Date | null>;
  endDate: FormControl<Date | null>;
  endTime: FormControl<Date | null>;
}

export const MAX_RANGES = 31;

export function rangeStart(v: ReturnType<FormGroup<RangeForm>['getRawValue']>): Date | null {
  return v.startDate && v.startTime ? combineDateAndTime(v.startDate, v.startTime) : null;
}

export function rangeEnd(v: ReturnType<FormGroup<RangeForm>['getRawValue']>): Date | null {
  return v.endDate && v.endTime ? combineDateAndTime(v.endDate, v.endTime) : null;
}

/** End must be after start, and overtime cannot be in the future (v1 had max = now). */
export function rangeValidator(group: AbstractControl): ValidationErrors | null {
  const v = (group as FormGroup<RangeForm>).getRawValue();
  const start = rangeStart(v);
  const end = rangeEnd(v);
  const errors: ValidationErrors = {};
  if (start && end && end <= start) {
    errors['wrongTime'] = true;
  }
  if (end && end > new Date()) {
    errors['future'] = true;
  }
  return Object.keys(errors).length ? errors : null;
}

@Component({
  selector: 'app-overtime-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatTimepickerModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './overtime-dialog.html',
  styleUrl: '../dialog-form.scss',
})
export class OvertimeDialog implements OnInit {
  private readonly api = inject(OvertimeService);
  private readonly dialog = inject(MatDialog);
  private readonly dialogRef = inject<MatDialogRef<OvertimeDialog, OvertimeDialogResult>>(MatDialogRef);
  protected readonly data = inject<OvertimeDialogData>(MAT_DIALOG_DATA);

  protected readonly today = new Date();
  protected readonly remarkMax = REMARK_MAX_LENGTH;

  protected readonly form = new FormGroup({
    projectNo: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(45)] }),
    remark: new FormControl<string | null>(null, Validators.maxLength(REMARK_MAX_LENGTH)),
    ranges: new FormArray<FormGroup<RangeForm>>([]),
  });

  ngOnInit(): void {
    if (this.data.mode === 'add') {
      this.addRange(this.data.date);
    } else {
      const o = this.data.overtime;
      this.form.patchValue({ projectNo: o.projectNo, remark: o.remark });
      const start = parseIsoDateTime(o.startTime);
      const end = parseIsoDateTime(o.endTime);
      this.form.controls.ranges.push(this.createRange(start, start, end, end));
    }
  }

  protected get ranges(): FormArray<FormGroup<RangeForm>> {
    return this.form.controls.ranges;
  }

  private createRange(
    startDate: Date | null,
    startTime: Date | null,
    endDate: Date | null,
    endTime: Date | null,
  ): FormGroup<RangeForm> {
    return new FormGroup<RangeForm>(
      {
        startDate: new FormControl(startDate, Validators.required),
        startTime: new FormControl(startTime, Validators.required),
        endDate: new FormControl(endDate, Validators.required),
        endTime: new FormControl(endTime, Validators.required),
      },
      { validators: rangeValidator },
    );
  }

  /** Adds a time range; new ranges default to the day of the previous one (or the clicked day). */
  protected addRange(day?: Date): void {
    if (this.ranges.length >= MAX_RANGES) {
      return;
    }
    const last = this.ranges.at(this.ranges.length - 1)?.getRawValue();
    const date = day ?? last?.startDate ?? new Date();
    this.ranges.push(this.createRange(date, null, date, null));
  }

  protected removeRange(index: number): void {
    if (this.ranges.length > 1) {
      this.ranges.removeAt(index);
    }
  }

  /** Keep the end date in step with the start date (most overtime ends on the same day). */
  protected onStartDateChange(range: FormGroup<RangeForm>): void {
    const { startDate, endDate } = range.getRawValue();
    if (startDate && (!endDate || endDate < startDate)) {
      range.controls.endDate.setValue(startDate);
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { projectNo, remark } = this.form.getRawValue();
    const cleanRemark = remark?.trim() ? remark.trim() : null;
    const timeRange = this.ranges.getRawValue().map((r) => ({
      startTime: toIsoDateTime(rangeStart(r) as Date),
      endTime: toIsoDateTime(rangeEnd(r) as Date),
    }));

    if (this.data.mode === 'add') {
      this.api
        .create({ projectNo: projectNo.trim(), remark: cleanRemark, timeRange })
        .subscribe(() => this.dialogRef.close({ action: 'saved' }));
    } else {
      this.api
        .update(this.data.overtime.id, { projectNo: projectNo.trim(), remark: cleanRemark, ...timeRange[0] })
        .subscribe(() => this.dialogRef.close({ action: 'updated' }));
    }
  }

  protected remove(): void {
    if (this.data.mode !== 'edit') {
      return;
    }
    const id = this.data.overtime.id;
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
}
