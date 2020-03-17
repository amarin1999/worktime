import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef
} from "@angular/material/dialog";
import { NgxSpinnerService } from "ngx-spinner";
import { Message } from "primeng/api";
import { finalize, take } from "rxjs/operators";
import { LayoutConstants } from "src/app/shared/constants/LayoutConstants";
import { SideWork } from "src/app/shared/interfaces/sidework";
import { SideworkService } from "src/app/shared/service/sidework.service";
import { ConfirmdialogComponent } from "../confirmdialog/confirmdialog.component";
@Component({
  selector: "app-sideworkform",
  templateUrl: "./sideworkform.component.html",
  styleUrls: ["./sideworkform.component.scss"]
})
export class SideworkformComponent implements OnInit {
  formGrid: string = LayoutConstants.gridFormPrimeNg;
  imgLogo: string = LayoutConstants.sideWorkImagePath;
  formGroupSideWork: FormGroup;
  dataSideWork: SideWork;
  date: Date = new Date();
  msgs: Message[] = [];
  // set วันที่
  dateRequest = `${this.date.getDate()}-${this.date.getMonth() +
    1}-${this.date.getFullYear() + 543}`;
  employeeNo: string = localStorage.getItem("employeeId");

  constructor(
    private dialogRef: MatDialogRef<SideworkformComponent>,
    private buildFormSideWork: FormBuilder,
    private sideWorkService: SideworkService,
    private dialogConfirm: MatDialog,
    private spinner: NgxSpinnerService
  ) {
    this.buildForm();
    this.getTimeOnDay();
  }

  ngOnInit(): void {}

  getTimeOnDay(): void {
    this.spinner.show();
    this.sideWorkService
      .getSideWorkOnDay(this.employeeNo, new Date())
      .pipe(
        take(1),
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe(
        res => {
          this.dataSideWork = res.data[0];
          this.checkTimeForm();
        },
        error => {
          console.table(error);
        }
      );
  }

  buildForm(): void {
    this.formGroupSideWork = this.buildFormSideWork.group(
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

  checkTimeForm(): void {
    // check วันเวลาเพื่อ disable form
    if (this.dataSideWork.startTime) {
      if (this.dataSideWork.endTime) {
        this.setValueForm();
        this.formGroupSideWork.disable();
        return;
      }
      //disable input วันที่เริ่ม
      this.formGroupSideWork.controls["startTime"].disable();
      this.setValueForm();
    }
  }

  setValueForm(): void {
    this.formGroupSideWork.controls["startTime"].disable();
    this.formGroupSideWork.patchValue({
      startTime: this.setStartTime(),
      endTime: this.setEndTime(),
      workAnyWhere: this.dataSideWork.workAnyWhere,
      remark: this.dataSideWork.remark
    });
  }
  setStartTime(): Date {
    return this.dataSideWork.startTime
      ? new Date(this.dataSideWork.startTime)
      : new Date();
  }
  setEndTime(): Date {
    return this.dataSideWork.endTime
      ? new Date(this.dataSideWork.endTime)
      : this.dataSideWork.startTime
      ? new Date()
      : null;
  }

  onSubmit(): void {
    //ถ้า validate ผ่าน
    if (this.formGroupSideWork.valid) {
      this.openDialogConfirm();
    } else if (this.formGroupSideWork.disable) {
      this.msgs = [];
      this.msgs.push({
        severity: "warn",
        summary: "แจ้งเตือน",
        detail:
          "คุณได้ลงเวลาสำหรับวันนี้ไปแล้ว หากต้องการแก้ไขไปที่ประวัติการลงเวลา"
      });
    }
  }

  openDialogConfirm(): void {
    //config dialog
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
          this.insertSidework();
        }
      });
  }

  insertSidework(): void {
    this.spinner.show();
    const request = {
      ...this.formGroupSideWork.getRawValue(),
      employeeNo: this.employeeNo
    };

    this.sideWorkService
      .addSidework(request)
      .pipe(
        take(1),
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
