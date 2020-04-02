import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgxSpinnerService } from "ngx-spinner";
import { finalize, first } from "rxjs/operators";
import { OvertimeWork } from "src/app/shared/interfaces/overtime";
import { Response } from "src/app/shared/interfaces/response";
import { OvertimeWorkService } from "src/app/shared/service/overtime.service";
import { InsertOvertimeWorkFormComponent } from "./insert-overtime-work-form/insert-overtime-work-form.component";

@Component({
  selector: "app-overtime-work",
  templateUrl: "./overtime-work.component.html",
  styleUrls: ["./overtime-work.component.scss"]
})
export class OvertimeWorkComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<InsertOvertimeWorkFormComponent>,
    private overtimeWorkService: OvertimeWorkService,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public dataForm: OvertimeWork
  ) {}

  ngOnInit(): void {}

  insertOvertimeWork(overtimeWorkItem: OvertimeWork) {
    this.spinner.show();
    const requestData = {
      ...overtimeWorkItem,
      employeeNo: localStorage.getItem("employeeNo")
    };
    this.overtimeWorkService
      .addOvertimeWork(requestData)
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
