import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable } from "rxjs";
import { finalize, first } from "rxjs/operators";
import { LayoutConstants } from "src/app/shared/constants/LayoutConstants";
import { SideWork } from "src/app/shared/interfaces/sidework";
import { SideworkService } from "src/app/shared/service/sidework.service";
import { SideworkformComponent } from "./sideworkform/sideworkform.component";

@Component({
  selector: "app-sidework",
  templateUrl: "./sidework.component.html",
  styleUrls: ["./sidework.component.scss"]
})
export class SideworkComponent implements OnInit {
  //constants
  imgLogo: string = LayoutConstants.sideWorkImagePath;
  //request
  requestDay: Observable<Object>;
  //data
  employeeNo: string = localStorage.getItem("employeeNo");
  //date
  date: Date = new Date();
  dateRequest = `${this.date.getDate()}-${this.date.getMonth() +
    1}-${this.date.getFullYear() + 543}`;

  constructor(
    private dialogRef: MatDialogRef<SideworkformComponent>,
    private sideWorkService: SideworkService,
    private spinner: NgxSpinnerService
  ) {
    this.getTimeOnDay();
  }

  ngOnInit(): void {}

  //เรียกเวลาวันนี้
  getTimeOnDay(): void {
    this.spinner.show();
    this.requestDay = this.sideWorkService
      .getSideWorkOnDay(this.employeeNo, new Date())
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      );
  }

  // เพิ่มข้อมูลลง DB
  insertSideWork(formItem: SideWork): void {
    this.spinner.show();
    const requestData = {
      ...formItem,
      employeeNo: this.employeeNo
    };

    this.sideWorkService
      .addSidework(requestData)
      .pipe(
        first(),
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe(
        response => {
          this.dialogRef.close(response);
        },
        error => {
          this.dialogRef.close(error);
        }
      );
  }
}
