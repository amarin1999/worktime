import { AfterViewInit, Component, Directive, effect, input, output, viewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Overtime, Sidework } from '../../core/api/models';
import { ThaiDatePipe, ThaiDateTimePipe, WorkAnywherePipe } from '../../shared/pipes';

const TABLE_IMPORTS = [
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatTooltipModule,
];

/** Shared table behaviour: data input, filter box, sort + paginator. */
@Directive()
abstract class HistoryTable<T> implements AfterViewInit {
  readonly data = input.required<T[]>();
  readonly edit = output<T>();

  protected readonly source = new MatTableDataSource<T>([]);
  private readonly sort = viewChild.required(MatSort);
  private readonly paginator = viewChild.required(MatPaginator);

  constructor() {
    effect(() => (this.source.data = this.data()));
  }

  ngAfterViewInit(): void {
    this.source.sort = this.sort();
    this.source.paginator = this.paginator();
  }

  protected applyFilter(event: Event): void {
    this.source.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }
}

@Component({
  selector: 'app-sidework-history-table',
  imports: [...TABLE_IMPORTS, ThaiDatePipe, WorkAnywherePipe],
  templateUrl: './sidework-history-table.html',
  styleUrl: './history-table.scss',
})
export class SideworkHistoryTable extends HistoryTable<Sidework> {
  protected readonly columns = ['date', 'startTime', 'endTime', 'workAnywhere', 'remark'];
}

@Component({
  selector: 'app-overtime-history-table',
  imports: [...TABLE_IMPORTS, ThaiDateTimePipe],
  templateUrl: './overtime-history-table.html',
  styleUrl: './history-table.scss',
})
export class OvertimeHistoryTable extends HistoryTable<Overtime> {
  protected readonly columns = ['projectNo', 'startTime', 'endTime', 'remark'];
}
