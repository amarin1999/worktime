import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable, Subject } from "rxjs";
import { first, finalize } from "rxjs/operators";
import { OvertimeWork } from "src/app/shared/interfaces/overtime";
import { Response } from "src/app/shared/interfaces/response";
import { SideWork } from "src/app/shared/interfaces/sidework";
import { OvertimeWorkService } from "src/app/shared/service/overtime.service";
import { SideWorkService } from "src/app/shared/service/sidework.service";

@Component({
  selector: "app-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.scss"]
})
export class HistoryComponent implements OnInit {
  sideWorkHistory: Subject<SideWork[]> = this.getHistorySideWork();
  overtimeWorkHistory: Subject<OvertimeWork[]> = this.getHistoryOvertimeWork();

  constructor(
    private sideWorkService: SideWorkService,
    private overtimeWorkService: OvertimeWorkService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.loadItemWork();
  }

  loadItemWork(): void {
    // load Sidework
    this.sideWorkService
      .getHistorySideWork(localStorage.getItem("employeeNo"))
      .pipe(
        first(),
        finalize(() => this.spinner.hide())
      )
      .subscribe(null, error => {
        console.log(error);
      });

    // load Ot
    this.overtimeWorkService
      .getHistoryOvertimeWork(localStorage.getItem("employeeNo"))
      .pipe(
        first(),
        finalize(() => this.spinner.hide())
      )
      .subscribe(null, error => {
        console.log(error);
      });
  }

  getHistorySideWork(): Subject<SideWork[]> {
    return this.sideWorkService.getSideWork();
  }

  getHistoryOvertimeWork(): Subject<OvertimeWork[]> {
    return this.overtimeWorkService.getOvertimeWork();
  }
}
