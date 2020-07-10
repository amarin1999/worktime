import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgxSpinnerService } from "ngx-spinner";
import { finalize, first } from "rxjs/operators";
import { LayoutConstants } from "src/app/shared/constants/LayoutConstants";
import { OvertimeWork } from "src/app/shared/interfaces/overtime";
import { Response } from "src/app/shared/interfaces/response";
import { OvertimeWorkService } from "src/app/shared/service/overtime.service";

@Component({
  selector: 'app-overtime-work',
  templateUrl: './overtime-work.component.html',
  styleUrls: ['./overtime-work.component.scss'],
})
export class OvertimeWorkComponent implements OnInit {
  img = {
    imgInsert: LayoutConstants.overtimeImagePath,
    imgEdit: LayoutConstants.editWorkImagePath,
  };

  constructor(
    private dialogRef: MatDialogRef<OvertimeWorkComponent>,
    private overtimeWorkService: OvertimeWorkService,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public dataForm: OvertimeWork
  ) {}

  ngOnInit(): void {}

  // เพิ่มข้อมูล ot
  insertOvertimeWork(overtimeWorkItem: OvertimeWork) {
    this.spinner.show();
    const requestData = {
      ...overtimeWorkItem,
      employeeNo: localStorage.getItem('employeeNo'),
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
        (error) => {
          this.dialogRef.close(error);
        }
      );
  }

  // แก้ไขข้อมูล ot
  editOvertimeWork(overtimeWorkItem: OvertimeWork): void {
    this.spinner.show();
    const requestData = {
      id: this.dataForm.id,
      ...overtimeWorkItem,
    };
    this.overtimeWorkService
      .editOvertimeWork(requestData)
      .pipe(
        first(),
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe(
        (response: Response) => {
          this.overtimeWorkService
            .setOvertimeWork(localStorage.getItem('employeeNo'))
            .pipe(first())
            .subscribe();
          this.dialogRef.close(response);
        },
        (error) => {
          this.dialogRef.close(error);
        }
      );
  }

  // ลบข้อมูล
  deleteOvertime(otId: number): void {
    this.spinner.show();
    this.overtimeWorkService
      .deleteOvertime(otId)
      .pipe(
        first(),
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe((error) => {
        this.dialogRef.close(error);
      });
  }
}
