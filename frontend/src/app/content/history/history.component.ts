import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { Response } from "src/app/shared/interfaces/response";
import { OvertimeWorkService } from "src/app/shared/service/overtime.service";
import { SideWorkService } from "src/app/shared/service/sidework.service";
export interface PeriodicElement {
  date: string | number | Date;
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: "app-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.scss"]
})
export class HistoryComponent implements OnInit {
  sideWorkHistory: Observable<Response> = this.getHistorySideWork();
  overtimeWorkHistory: Observable<Response> = this.getHistoryOvertimeWork();

  constructor(
    private sideWorkService: SideWorkService,
    private overtimeWorkService: OvertimeWorkService,
    private spinner: NgxSpinnerService,

  ) {}

  ngOnInit(): void {}

  getHistorySideWork(): Observable<Response> {
    this.spinner.show();
    return this.sideWorkService
      .getHistorySideWork(localStorage.getItem("employeeNo"))
      .pipe(finalize(() => this.spinner.hide()));
  }

  getHistoryOvertimeWork(): Observable<Response> {
    this.spinner.show();
    return this.overtimeWorkService
      .getHistoryOvertimeWork(localStorage.getItem("employeeNo"))
      .pipe(finalize(() => this.spinner.hide()));
  }
}
