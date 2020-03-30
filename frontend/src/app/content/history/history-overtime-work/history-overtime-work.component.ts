import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import { PeriodicElement } from "../history.component";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

@Component({
  selector: "app-history-overtime-work",
  templateUrl: "./history-overtime-work.component.html",
  styleUrls: ["./history-overtime-work.component.scss"]
})
export class HistoryOvertimeWorkComponent implements OnInit, OnChanges {
  @Input("overtimeWorkHistory") dataOvertimeWork: PeriodicElement[];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  displayedColumns: string[] = ["idProject", "startTime", "endTime", "remark"];

  // source
  dataSource = new MatTableDataSource<PeriodicElement>(this.dataOvertimeWork);

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.dataSource = new MatTableDataSource<PeriodicElement>(
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