import {
  Component,
  OnInit,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { PeriodicElement } from "../history.component";

@Component({
  selector: "app-history-side-work",
  templateUrl: "./history-side-work.component.html",
  styleUrls: ["./history-side-work.component.scss"]
})
export class HistorySideWorkComponent implements OnInit, OnChanges {
  @Input("sideWorkHistory") dataSideWork: PeriodicElement[];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  // column
  displayedColumns: string[] = ["date", "startTime", "endTime", "remark"];

  // source
  dataSource = new MatTableDataSource<PeriodicElement>(this.dataSideWork);
  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.dataSource = new MatTableDataSource<PeriodicElement>(
        this.dataSideWork
      );
    }
    this.dataSource.paginator = this.paginator;
  }
}
