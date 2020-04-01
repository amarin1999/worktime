import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { OvertimeWork } from 'src/app/shared/interfaces/overtime';

@Component({
  selector: "app-history-overtime-work",
  templateUrl: "./history-overtime-work.component.html",
  styleUrls: ["./history-overtime-work.component.scss"]
})
export class HistoryOvertimeWorkComponent implements OnInit, OnChanges {
  @Input("overtimeWorkHistory") dataOvertimeWork: OvertimeWork[];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  displayedColumns: string[] = ["idProject", "startTime", "endTime", "remark"];

  // source
  dataSource = new MatTableDataSource<OvertimeWork>(this.dataOvertimeWork);

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.dataSource = new MatTableDataSource<OvertimeWork>(
        this.dataOvertimeWork
      );
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
