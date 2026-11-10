import { AfterViewInit, Component, OnInit, inject, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EmployeeByDay, WORK_ANYWHERE, WorkAnywhere } from '../../core/api/models';
import { CalendarDataService } from '../../core/api/worktime-api.service';
import { formatThaiDate, toIsoDate } from '../../core/util/date-utils';
import { WorkAnywherePipe } from '../../shared/pipes';

export interface EmployeesByDayDialogData {
  date: Date;
  /** Show the "ลงเวลา" button (when opened from a click on an empty day). */
  allowInsert: boolean;
}

export interface EmployeesByDayDialogResult {
  action: 'insert';
  date: Date;
}

/** Who worked where on a given day (shown to admins when they click a day). */
@Component({
  selector: 'app-employees-by-day-dialog',
  imports: [
    FormsModule,
    MatDialogModule,
    MatRadioModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    WorkAnywherePipe,
  ],
  templateUrl: './employees-by-day-dialog.html',
  styleUrl: './employees-by-day-dialog.scss',
})
export class EmployeesByDayDialog implements OnInit, AfterViewInit {
  private readonly api = inject(CalendarDataService);
  private readonly dialogRef =
    inject<MatDialogRef<EmployeesByDayDialog, EmployeesByDayDialogResult>>(MatDialogRef);
  protected readonly data = inject<EmployeesByDayDialogData>(MAT_DIALOG_DATA);
  private readonly paginator = viewChild.required(MatPaginator);

  protected readonly WA = WORK_ANYWHERE;
  protected readonly dateText = formatThaiDate(toIsoDate(this.data.date));
  protected readonly columns = ['employeeNo', 'firstname', 'lastname', 'workAnywhere', 'remark'];
  protected readonly source = new MatTableDataSource<EmployeeByDay>([]);
  /** `null` = all types. */
  protected filter: WorkAnywhere | null = null;

  ngOnInit(): void {
    this.load();
  }

  ngAfterViewInit(): void {
    this.source.paginator = this.paginator();
  }

  protected load(): void {
    this.api
      .employeesByDay(toIsoDate(this.data.date), this.filter ?? undefined)
      .subscribe((list) => (this.source.data = list));
  }

  protected search(value: string): void {
    this.source.filter = value.trim().toLowerCase();
  }

  protected insert(): void {
    this.dialogRef.close({ action: 'insert', date: this.data.date });
  }
}
