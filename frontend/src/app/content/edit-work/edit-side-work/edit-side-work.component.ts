import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { SideWork } from "src/app/shared/interfaces/sidework";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LayoutConstants } from "src/app/shared/constants/LayoutConstants";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../../confirmdialog/confirmdialog.component";
import { first } from "rxjs/operators";

@Component({
  selector: "app-edit-side-work",
  templateUrl: "./edit-side-work.component.html",
  styleUrls: ["./edit-side-work.component.scss"]
})
export class EditSideWorkComponent implements OnInit {
  @Input("dataSideWork") dataSideWork: SideWork;
  @Output() patchEmit: EventEmitter<SideWork> = new EventEmitter();
  //constants
  formGrid: string = LayoutConstants.gridFormPrimeNg;
  //form
  formGroupSideWork: FormGroup;
  //img
  imgLogo: string = LayoutConstants.sideWorkImagePath;
  constructor(
    private buildForm: FormBuilder,
    private dialogConfirm: MatDialog
  ) {}

  ngOnInit(): void {
    this.createFormSideWork();
  }

  //สร้าง form
  createFormSideWork(): void {
    this.formGroupSideWork = this.buildForm.group(
      {
        startTime: [new Date(), [Validators.required]],
        endTime: [null],
        workAnyWhere: [false],
        remark: [null, [Validators.maxLength(250)]]
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
      .subscribe((confirmStatus: boolean) => {
        if (confirmStatus) {
          this.patchEmit.emit(this.formGroupSideWork.getRawValue());
        }
      });
  }
}
