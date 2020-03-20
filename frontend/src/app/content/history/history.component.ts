import { Component, OnInit } from "@angular/core";
import { SideWorkService } from "src/app/shared/service/sidework.service";
import { Observable } from "rxjs";
import { Response } from "src/app/shared/interfaces/response";
import { finalize } from "rxjs/operators";
import { NgxSpinnerService } from "ngx-spinner";
import { LayoutConstants } from "src/app/shared/constants/LayoutConstants";
import { OvertimeWorkService } from "src/app/shared/service/overtime.service";
import { FormatDateThPipe } from "src/app/shared/pipe/format-date-th.pipe";
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
  sideWorkHistory;
  overtimeWorkHistory: Observable<Response> = this.getHistoryOvertimeWork();
  cdgImagePath: string = LayoutConstants.cdgImagePath;

  constructor(
    private sideWorkService: SideWorkService,
    private overtimeWorkService: OvertimeWorkService,
    private spinner: NgxSpinnerService,
    private pipeDate: FormatDateThPipe
  ) {
    this.getHistorySideWork();
  }

  ngOnInit(): void {}

  getHistorySideWork() {
    this.spinner.show();
    this.sideWorkService
      .getHistorySideWork(localStorage.getItem("employeeNo"))
      .pipe(finalize(() => this.spinner.hide()))
      .subscribe(response => {
        console.log(response);
        console.log({ response });

        this.setValue(response.data);
      });
  }

  getHistoryOvertimeWork() {
    this.spinner.show();
    return this.overtimeWorkService
      .getHistoryOvertimeWork(localStorage.getItem("employeeNo"))
      .pipe(finalize(() => this.spinner.hide()));
  }

  setValue(value) {
    this.sideWorkHistory = value.map(item => {
      console.log(item);
      return {
        ...item,
        day: this.pipeDate.transform(item.startTime, "day"),
        startTime: this.pipeDate.transform(item.startTime, "time"),
        endTime: this.pipeDate.transform(item.startTime, "time")
      };
    });
    console.log(this.sideWorkHistory);
  }
}
