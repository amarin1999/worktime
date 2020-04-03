import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import * as moment from "moment";
import { first } from "rxjs/operators";
import { LayoutConstants } from "src/app/shared/constants/LayoutConstants";
import { OvertimeWork } from "src/app/shared/interfaces/overtime";
import { ConfirmDialogComponent } from "../../confirmdialog/confirmdialog.component";

@Component({
  selector: "app-edit-overtime-work-form",
  templateUrl: "./edit-overtime-work-form.component.html",
  styleUrls: ["./edit-overtime-work-form.component.scss"]
})
export class EditOvertimeWorkFormComponent implements OnInit {
  @Input("dataForm") dataForm: OvertimeWork;
  @Output() editEmit: EventEmitter<any> = new EventEmitter();
  // constants
  formGrid: string = LayoutConstants.gridFormPrimeNg;

  // form
  formGroupOvertimeWork: FormGroup;

  constructor(
    private buildForm: FormBuilder,
    private dialogConfirm: MatDialog
  ) {}

  ngOnInit(): void {
    this.buildFormOvertime();
  }

  // สร้างฟอร์ม
  buildFormOvertime(): void {
    //set date format to form
    const startTime = moment(
      this.dataForm.startTime,
      "DD/MM/YYYY HH:mm:ss"
    ).format("YYYY/MM/DD HH:mm:ss");
    const endTime = moment(this.dataForm.endTime, "DD/MM/YYYY HH:mm:ss").format(
      "YYYY/MM/DD HH:mm:ss"
    );

    this.formGroupOvertimeWork = this.buildForm.group(
      {
        startTime: [new Date(startTime), [Validators.required]],
        endTime: [new Date(endTime), [Validators.required]],
        projectNo: [
          this.dataForm.idProject,
          [Validators.required, Validators.maxLength(45)]
        ],
        remark: [this.dataForm.remark, [Validators.maxLength(250)]]
      },
      {
        validators: [this.compareTime]
      }
    );
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
      ConfirmDialogComponent,
      configDialog
    );
    //หลังปิด dialog
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(confirmStatus => {
        if (confirmStatus) {
          this.editEmit.emit(this.formGroupOvertimeWork.getRawValue());
        }
      });
  }
}
