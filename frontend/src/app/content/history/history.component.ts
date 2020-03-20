import { Component, OnInit } from "@angular/core";
import { SideWorkService } from "src/app/shared/service/sidework.service";
import { Observable } from "rxjs";
import { Response } from "src/app/shared/interfaces/response";
import { finalize } from "rxjs/operators";
import { NgxSpinnerService } from "ngx-spinner";
import { LayoutConstants } from "src/app/shared/constants/LayoutConstants";
import { OvertimeWorkService } from "src/app/shared/service/overtime.service";
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
  cdgImagePath: string = LayoutConstants.cdgImagePath;

  constructor(
    private sideWorkService: SideWorkService,
    private overtimeWorkService: OvertimeWorkService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {}

  getHistorySideWork() {
    this.spinner.show();
    return this.sideWorkService
      .getHistorySideWork(localStorage.getItem("employeeNo"))
      .pipe(finalize(() => this.spinner.hide()));
  }

  getHistoryOvertimeWork() {
    this.spinner.show();
    return this.overtimeWorkService
      .getHistoryOvertimeWork(localStorage.getItem("employeeNo"))
      .pipe(finalize(() => this.spinner.hide()));
  }
}
