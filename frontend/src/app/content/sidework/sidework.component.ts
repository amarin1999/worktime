import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { NgxSpinnerService } from "ngx-spinner";
import { finalize, first } from "rxjs/operators";
import { LayoutConstants } from "src/app/shared/constants/LayoutConstants";
import { Response } from "src/app/shared/interfaces/response";
import { SideWork } from "src/app/shared/interfaces/sidework";
import { SideWorkService } from "src/app/shared/service/sidework.service";
import { SideWorkFormComponent } from "./sideworkform/sideworkform.component";

@Component({
  selector: "app-sidework",
  templateUrl: "./sidework.component.html",
  styleUrls: ["./sidework.component.scss"]
})
export class SideWorkComponent implements OnInit {
  //constants
  imgLogo: string = LayoutConstants.sideWorkImagePath;
  //request
  requestDay = this.getTimeOnDay();

  constructor(
    private dialogRef: MatDialogRef<SideWorkFormComponent>,
    private sideWorkService: SideWorkService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {}

  //เรียกเวลาวันนี้
  getTimeOnDay() {
    this.spinner.show();
    return this.sideWorkService
      .getSideWorkOnDay(localStorage.getItem("employeeNo"), new Date())
      .pipe(finalize(() => this.spinner.hide()));
  }

  // เพิ่มข้อมูลลง DB
  insertSideWork(formItem: SideWork): void {
    this.spinner.show();
    const requestData = {
      ...formItem,
      employeeNo: localStorage.getItem("employeeNo")
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
        (response: Response) => {
          this.dialogRef.close(response);
        },
        error => {
          this.dialogRef.close(error);
        }
      );
  }
}
