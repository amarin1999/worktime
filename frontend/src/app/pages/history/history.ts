import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { Overtime, Sidework } from '../../core/api/models';
import { OvertimeService, SideworkService } from '../../core/api/worktime-api.service';
import { AuthService } from '../../core/auth/auth.service';
import { WorkDialogs } from '../../dialogs/work-dialogs.service';
import { Banner } from '../../shared/banner';
import { OvertimeHistoryTable, SideworkHistoryTable } from './history-tables';

/** History of the current user's work-anywhere and overtime records (two tabs). */
@Component({
  selector: 'app-history',
  imports: [Banner, MatTabsModule, MatIconModule, SideworkHistoryTable, OvertimeHistoryTable],
  template: `
    <app-banner text="ประวัติการลงเวลาทำงาน" />
    <div class="wrap animation-page">
      <mat-tab-group>
        <mat-tab>
          <ng-template mat-tab-label><mat-icon>home_work</mat-icon>&nbsp; ทำงานนอกสถานที่</ng-template>
          <app-sidework-history-table [data]="sideworks()" (edit)="editSidework($event)" />
        </mat-tab>
        <mat-tab>
          <ng-template mat-tab-label><mat-icon>access_time</mat-icon>&nbsp; ทำงานนอกเวลา</ng-template>
          <app-overtime-history-table [data]="overtimes()" (edit)="editOvertime($event)" />
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: `
    .wrap {
      width: 83%;
      margin: 0 auto 60px;
      padding: 0 12px 12px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.8);
    }
    @media screen and (max-width: 768px) {
      .wrap {
        width: 98%;
      }
    }
  `,
})
export class History {
  private readonly sideworkApi = inject(SideworkService);
  private readonly overtimeApi = inject(OvertimeService);
  private readonly dialogs = inject(WorkDialogs);
  private readonly auth = inject(AuthService);

  protected readonly sideworks = signal<Sidework[]>([]);
  protected readonly overtimes = signal<Overtime[]>([]);

  constructor() {
    this.loadSidework();
    this.loadOvertime();
  }

  private loadSidework(): void {
    this.sideworkApi.list().subscribe((list) => this.sideworks.set(list));
  }

  private loadOvertime(): void {
    this.overtimeApi.list().subscribe((list) => this.overtimes.set(list));
  }

  protected editSidework(item: Sidework): void {
    this.dialogs.editSidework(item, this.auth.isAdmin()).subscribe((changed) => changed && this.loadSidework());
  }

  protected editOvertime(item: Overtime): void {
    this.dialogs.editOvertime(item).subscribe((changed) => changed && this.loadOvertime());
  }
}
