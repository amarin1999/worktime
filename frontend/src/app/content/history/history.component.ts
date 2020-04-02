import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable, Subject } from "rxjs";
import { finalize, first } from "rxjs/operators";
import { Response } from "src/app/shared/interfaces/response";
import { OvertimeWorkService } from "src/app/shared/service/overtime.service";
import { SideWorkService } from "src/app/shared/service/sidework.service";
import { SideWork } from "src/app/shared/interfaces/sidework";

@Component({
  selector: "app-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.scss"]
})
export class HistoryComponent implements OnInit {
  sideWorkHistory: Subject<SideWork[]> = this.getHistorySideWork();
  overtimeWorkHistory: Observable<Response> = this.getHistoryOvertimeWork();

  constructor(
    private sideWorkService: SideWorkService,
    private overtimeWorkService: OvertimeWorkService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.sideWorkService
      .getHistorySideWork(localStorage.getItem("employeeNo"))
      .pipe(first())
      .subscribe();
  }

  getHistorySideWork(): Subject<SideWork[]> {
    return this.sideWorkService.getSideWork();
  }

  getHistoryOvertimeWork(): Observable<Response> {
    this.spinner.show();
    return this.overtimeWorkService
      .getHistoryOvertimeWork(localStorage.getItem("employeeNo"))
      .pipe(finalize(() => this.spinner.hide()));
  }
}
