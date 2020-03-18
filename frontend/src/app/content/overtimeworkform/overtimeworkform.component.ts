import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { take } from "rxjs/operators";
import { LayoutConstants } from "src/app/shared/constants/LayoutConstants";
import { OvertimeService } from "src/app/shared/service/overtime.service";
import { ConfirmdialogComponent } from "../confirmdialog/confirmdialog.component";

@Component({
  selector: "app-overtimeworkform",
  templateUrl: "./overtimeworkform.component.html",
  styleUrls: ["./overtimeworkform.component.scss"]
})
export class OvertimeworkformComponent implements OnInit {
  // constants
  formGrid: string = LayoutConstants.gridFormPrimeNg;
  imgLogo: string = LayoutConstants.overtimeImagePath;
  // form
  formGroupOvertimeWork: FormGroup;

  constructor(
    private buildForm: FormBuilder,
    private overtimeService: OvertimeService,
    private dialogConfirm: MatDialog
  ) {}

  ngOnInit(): void {
    this.buildFormOvertime();
    this.addTime();
  }

  // สร้างฟอร์ม
  buildFormOvertime(): void {
    this.formGroupOvertimeWork = this.buildForm.group({
      timeRange: new FormArray([]),
      projectNo: [null, [Validators.required, Validators.maxLength(45)]],
      remark: [null, [Validators.maxLength(250)]]
    });
  }

  // ส่ง formarray ไปวนลูป html
  get formTimeRangeData(): FormArray {
    return this.formGroupOvertimeWork.get("timeRange") as FormArray;
  }

  // เพิ่มเวลา Formarray
  pushTime(): FormArray {
    return this.formGroupOvertimeWork.get("timeRange") as FormArray;
  }

  // กดปุ่มแล้วเพิ่มเวลา
  addTime(): void {
    const rangeTime = this.buildForm.group(
      {
        startTime: [null, [Validators.required]],
        endTime: [null, [Validators.required]]
      },
      {
        validators: [this.compareTime]
      }
    );
    this.pushTime().push(rangeTime);
  }

  // ลบ formarray item
  removeTimeRangeItem(index: number): void {
    this.formTimeRangeData.removeAt(index);
  }

  // validate เวลา
  compareTime(group: FormGroup): void {
    let startTime = group.get("startTime").value;
    let endTime = group.get("endTime").value;
    if (startTime > endTime && endTime !== null) {
      group.get("endTime").setValue(undefined);
      group.get("endTime").setErrors({ wrongDate: true });
    } else {
      return null;
    }
  }

  // submit
  onSubmit(): void {
    if (this.formGroupOvertimeWork.valid) {
      console.log(this.formGroupOvertimeWork.getRawValue());
      
      this.openDialogConfirm();
    }
  }

  // show confirm return true | false
  openDialogConfirm(): void {
    const configDialog: MatDialogConfig<any> = {
      disableClose: true,
      autoFocus: false,
      width: "370px",
      height: "170px",
      data: {
        textConfirm: "ยืนยันการเพิ่มข้อมูลการลงเวลางาน ?"
      }
    };
    //เปิด dialog
    const dialogRef = this.dialogConfirm.open(
      ConfirmdialogComponent,
      configDialog
    );
    //หลังปิด dialog
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe(confirmStatus => {
        if (confirmStatus) {
          this.insertOvertimeWork();
        }
      });
  }

  // เพิ่มข้อมูลลง DB
  insertOvertimeWork(): void {
    // const requestData = {
    //   ...this.formGroupOvertimeWork.getRawValue(),
    //   employeeNo: localStorage.getItem("employeeId")
    // };
    // this.overtimeService.addOverti   meWork(requestData).subscribe(res => {
    //   console.log({ res });
    // });
    // this.spinner.show();
    // const request = {
    //   ...this.formGroupSideWork.getRawValue(),
    //   employeeNo: this.employeeNo
    // };
    // this.sideWorkService
    //   .addSidework(request)
    //   .pipe(
    //     take(1),
    //     finalize(() => {
    //       this.spinner.hide();
    //     })
    //   )
    //   .subscribe(
    //     response => {
    //       this.dialogRef.close(response);
    //     },
    //     error => {
    //       this.dialogRef.close(error);
    //     }
    //   );
  }
}
