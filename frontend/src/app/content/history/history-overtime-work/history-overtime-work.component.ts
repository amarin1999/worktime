import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { PeriodicElement } from "../history.component";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-history-overtime-work",
  templateUrl: "./history-overtime-work.component.html",
  styleUrls: ["./history-overtime-work.component.scss"]
})
export class HistoryOvertimeWorkComponent implements OnInit, OnChanges {
  @Input("overtimeWorkHistory") dataOvertimeWork: PeriodicElement[];
  constructor() {}

  ngOnInit(): void {
    console.log(this.dataOvertimeWork);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      console.log(this.dataOvertimeWork);
    }
  }
}
