import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { first } from "rxjs/operators";
import { LayoutConstants } from "src/app/shared/constants/LayoutConstants";
import { ConfirmDialogComponent } from "../../confirm-dialog/confirm-dialog.component";

@Component({
  selector: "app-insert-overtime-work-form",
  templateUrl: "./insert-overtime-work-form.component.html",
  styleUrls: ["./insert-overtime-work-form.component.scss"]
})
export class InsertOvertimeWorkFormComponent implements OnInit {
  @Output() insertEmit: EventEmitter<any> = new EventEmitter();
  // constants
  formGrid: string = LayoutConstants.gridFormPrimeNg;
  // date
  maxDate: Date = new Date();
  // form
  formGroupOvertimeWork: FormGroup;

  constructor(
    private buildForm: FormBuilder,
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
    if (this.formTimeRangeData.length !== 1) {
      this.formTimeRangeData.removeAt(index);
    }
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
      this.insertEmit.emit(this.formGroupOvertimeWork.getRawValue());
    }
  }

  // show confirm return true | false
  // openDialogConfirm(): void {
  //   const configDialog: MatDialogConfig<any> = {
  //     disableClose: true,
  //     autoFocus: false,
  //     width: "370px",
  //     height: "170px",
  //     data: {
  //       textConfirm: "ยืนยันการเพิ่มข้อมูลการลงเวลางาน ?"
  //     }
  //   };
  //   //เปิด dialog
  //   const dialogRef = this.dialogConfirm.open(
  //     ConfirmDialogComponent,
  //     configDialog
  //   );
  //   //หลังปิด dialog
  //   dialogRef
  //     .afterClosed()
  //     .pipe(first())
  //     .subscribe(confirmStatus => {
  //       if (confirmStatus) {
  //         this.insertEmit.emit(this.formGroupOvertimeWork.getRawValue());
  //       }
  //     });
  // }
}
