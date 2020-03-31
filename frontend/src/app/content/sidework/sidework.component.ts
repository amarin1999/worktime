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
  isDateValid: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<SideWorkFormComponent>,
    private sideWorkService: SideWorkService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {}

  checkDay(date: Date): void {
    this.spinner.show();
    this.sideWorkService
      .getSideWorkOnDay(localStorage.getItem("employeeNo"), date)
      .pipe(
        first(),
        finalize(() => this.spinner.hide())
      )
      .subscribe(
        (res: Response) => {
          if (res.code === 200) {
            this.isDateValid = true;
          } else if (res.code === 404) {
            this.isDateValid = false;
          }
        },
        error => {
          console.log(error);
        }
      );
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
