import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { first } from "rxjs/operators";
import { LayoutConstants } from "src/app/shared/constants/LayoutConstants";
import { SideWork } from "src/app/shared/interfaces/sidework";
import { ConfirmDialogComponent } from "../../confirm-dialog/confirm-dialog.component";
import { Router } from '@angular/router';

@Component({
  selector: "app-edit-side-work-form",
  templateUrl: "./edit-side-work-form.component.html",
  styleUrls: ["./edit-side-work-form.component.scss"]
})
export class EditSideWorkFormComponent implements OnInit {
  @Input("dataForm") dataForm: SideWork;
  @Output() editEmit: EventEmitter<SideWork> = new EventEmitter();

  //constants
  formGrid: string = LayoutConstants.gridFormPrimeNg;
  //form
  formGroupSideWork: FormGroup;

  constructor(
    private buildForm: FormBuilder,
    private dialogConfirm: MatDialog,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.createFormSideWork();
  }

  //สร้าง form
  createFormSideWork(): void {
    this.formGroupSideWork = this.buildForm.group(
      {
        date: [
          { value: this.dataForm.date, disabled: true },
          [Validators.required]
        ],
        startTime: [this.dataForm.startTime, [Validators.required]],
        endTime: [this.dataForm.endTime, [Validators.required]],
        workAnyWhere: [this.dataForm.workAnyWhere],
        remark: [this.dataForm.remark, [Validators.maxLength(250)]]
      },
      {
        validators: [this.compareTime]
      }
    );
  }

  //validate เวลา
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

  // กดปุ่ม
  onSubmit(): void {
    //ถ้า validate ผ่าน
    if (this.formGroupSideWork.valid) {
      this.editEmit.emit(this.formGroupSideWork.getRawValue());
    }
    // reload calendar when submit
    this.route.navigateByUrl('', { skipLocationChange: true }).then(() => {
      this.route.navigate(['main/sidework-calendar']);
    });
  }

  // show confirm return true | false
  // openDialogConfirm(): void {
  //   const configDialog: MatDialogConfig<any> = {
  //     disableClose: true,
  //     autoFocus: false,
  //     width: "370px",
  //     height: "170px",
  //     data: {
  //       textConfirm: "ยืนยันการแก้ไขการลงเวลางาน ?"
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
  //     .subscribe((confirmStatus: boolean) => {
  //       if (confirmStatus) {
  //         this.editEmit.emit(this.formGroupSideWork.getRawValue());
  //       }
  //     });
  // }
}
