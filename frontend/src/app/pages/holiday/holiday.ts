import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { catchError, of, switchMap } from 'rxjs';
import { Holiday } from '../../core/api/models';
import { buddhistYear } from '../../core/util/date-utils';
import { CalendarDataService } from '../../core/api/worktime-api.service';
import { Banner } from '../../shared/banner';
import { ThaiDatePipe } from '../../shared/pipes';

/**
 * Company holidays of a year (GET /holidays).
 * v1 only had an unfinished PrimeNG calendar demo on this route.
 */
@Component({
  selector: 'app-holiday',
  imports: [Banner, MatTableModule, MatButtonModule, MatIconModule, ThaiDatePipe],
  template: `
    <app-banner text="วันหยุดประจำปี" />
    <div class="wrap animation-page">
      <div class="year">
        <button mat-icon-button type="button" (click)="year.set(year() - 1)" aria-label="ปีก่อนหน้า">
          <mat-icon>chevron_left</mat-icon>
        </button>
        <span>{{ buddhistYear() }}</span>
        <button mat-icon-button type="button" (click)="year.set(year() + 1)" aria-label="ปีถัดไป">
          <mat-icon>chevron_right</mat-icon>
        </button>
      </div>
      <table mat-table [dataSource]="holidays()" class="mat-elevation-z8 data-table">
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef>วันที่</th>
          <td mat-cell *matCellDef="let h">{{ h.date | thaiDate }}</td>
        </ng-container>
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef>วันหยุด</th>
          <td mat-cell *matCellDef="let h">{{ h.title }}</td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns"></tr>
      </table>
    </div>
  `,
  styles: `
    .wrap {
      width: 66%;
      margin: 0 auto 60px;
    }
    .year {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5em;
      color: #333377;
    }
    @media screen and (max-width: 640px) {
      .wrap {
        width: 95%;
      }
    }
  `,
})
export class HolidayPage {
  private readonly api = inject(CalendarDataService);
  protected readonly columns = ['date', 'title'];
  protected readonly year = signal(new Date().getFullYear());
  /** Buddhist-era label of the selected year (real Buddhist calendar, no arithmetic). */
  protected readonly buddhistYear = computed(() => buddhistYear(this.year()));
  protected readonly holidays = toSignal(
    toObservable(this.year).pipe(
      switchMap((y) => this.api.holidays(y).pipe(catchError(() => of<Holiday[]>([])))),
    ),
    { initialValue: [] },
  );
}
