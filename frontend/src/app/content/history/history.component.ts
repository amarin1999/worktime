import { Component, OnInit } from "@angular/core";
import { SideWorkService } from "src/app/shared/service/sidework.service";
import { Observable } from "rxjs";
import { Response } from "src/app/shared/interfaces/response";
import { finalize } from "rxjs/operators";
import { NgxSpinnerService } from "ngx-spinner";
export interface PeriodicElement {
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
  constructor(
    private sideWorkService: SideWorkService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {}

  getHistorySideWork() {
    this.spinner.show();
    return this.sideWorkService
      .getHistorySideWork(localStorage.getItem("employeeNo"))
      .pipe(finalize(() => this.spinner.hide()));
  }
}
