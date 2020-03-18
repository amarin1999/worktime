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
  //constants
  formGrid: string = LayoutConstants.gridFormPrimeNg;
  imgLogo: string = LayoutConstants.sideWorkImagePath;
  //form
  formGroupSideWork: FormGroup;
  //data
  dataSideWork: SideWork;
  employeeNo: string = localStorage.getItem("employeeId");
  //date
  date: Date = new Date();
  dateRequest = `${this.date.getDate()}-${this.date.getMonth() +
    1}-${this.date.getFullYear() + 543}`;
  //message
  msgs: Message[] = [];
  // set วันที่

  constructor(
    private dialogRef: MatDialogRef<SideworkformComponent>,
    private buildForm: FormBuilder,
    private sideWorkService: SideworkService,
    private dialogConfirm: MatDialog,
    private spinner: NgxSpinnerService
  ) {
    this.createFormSideWork();
    this.getTimeOnDay();
  }

  ngOnInit(): void {}

  //เรียกเวลาวันนี้
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

  // check วันเวลาเพื่อ disable form
  checkTimeForm(): void {
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

  // patch ข้อมูลตามที่มี
  setValueForm(): void {
    this.formGroupSideWork.patchValue({
      startTime: this.setStartTime(),
      endTime: this.setEndTime(),
      workAnyWhere: this.dataSideWork.workAnyWhere,
      remark: this.dataSideWork.remark
    });
  }

  // เงื่อนไข Starttime
  setStartTime(): Date {
    return this.dataSideWork.startTime
      ? new Date(this.dataSideWork.startTime)
      : new Date();
  }

  // เงื่อนไข Endtime
  setEndTime(): Date {
    return this.dataSideWork.endTime
      ? new Date(this.dataSideWork.endTime)
      : this.dataSideWork.startTime
      ? new Date()
      : null;
  }

  // กดปุ่ม
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
          this.insertSideWork();
        }
      });
  }

  // เพิ่มข้อมูลลง DB
  insertSideWork(): void {
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
