import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
// moment
import * as moment from "moment";
import { Message } from "primeng/api";
import { first } from "rxjs/operators";
import { LayoutConstants } from "src/app/shared/constants/LayoutConstants";
import { SideWork } from "src/app/shared/interfaces/sidework";
import { ConfirmDialogComponent } from "../../confirmdialog/confirmdialog.component";
@Component({
  selector: "app-sideworkform",
  templateUrl: "./sideworkform.component.html",
  styleUrls: ["./sideworkform.component.scss"]
})
export class SideWorkFormComponent implements OnInit, OnChanges {
  @Input("dataSideWork") dataSideWork: SideWork;
  @Output() insertEmit: EventEmitter<SideWork> = new EventEmitter();
  //constants
  formGrid: string = LayoutConstants.gridFormPrimeNg;
  //form
  formGroupSideWork: FormGroup;
  //message
  msgs: Message[] = [];
  minDate = new Date(-1);
  maxDate = new Date();

  constructor(
    private buildForm: FormBuilder,
    private dialogConfirm: MatDialog
  ) {}

  ngOnInit(): void {
    this.createFormSideWork();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes) {
    //   this.checkTimeForm();
    // }
  }

  //สร้าง form
  createFormSideWork(): void {
    this.formGroupSideWork = this.buildForm.group(
      {
        day: [null, [Validators.required]],
        startTime: [null, [Validators.required]],
        endTime: [null, [Validators.required]],
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
  // lateTime(group: FormGroup): void {
  //   let endTime = moment(group.get("endTime").value).format("l");
  //   let lateDay = moment(group.get("startTime").value)
  //     .add(1, "day")
  //     .format("l");
  //   if (endTime > lateDay) {
  //     group.get("endTime").setValue(undefined);
  //     group.get("endTime").setErrors({ lateDate: true });
  //   } else {
  //     return null;
  //   }
  // }
  // check วันเวลาเพื่อ disable form
  // checkTimeForm(): void {
  //   if (this.dataSideWork?.startTime) {
  //     if (this.dataSideWork?.endTime) {
  //       this.setValueForm();
  //       this.formGroupSideWork.disable();
  //       return;
  //     }
  //     //disable input วันที่เริ่ม
  //     this.formGroupSideWork.controls["startTime"].disable();
  //     this.formGroupSideWork.controls["endTime"].disable();
  //     this.setValueForm();
  //   }
  // }

  // // patch ข้อมูลตามที่มี
  // setValueForm(): void {
  //   this.formGroupSideWork.patchValue({
  //     startTime: this.setStartTime(),
  //     endTime: this.setEndTime(),
  //     workAnyWhere: this.dataSideWork.workAnyWhere,
  //     remark: this.dataSideWork.remark
  //   });
  // }

  // // เงื่อนไข Starttime
  // setStartTime(): Date {
  //   return this.dataSideWork.startTime
  //     ? new Date(this.dataSideWork.startTime)
  //     : new Date();
  // }

  // // เงื่อนไข Endtime
  // setEndTime(): Date {
  //   return this.dataSideWork.endTime
  //     ? new Date(this.dataSideWork.endTime)
  //     : this.dataSideWork.startTime
  //     ? new Date()
  //     : null;
  // }

  // กดปุ่ม
  onSubmit(): void {
    //ถ้า validate ผ่าน
    if (this.formGroupSideWork.valid) {
      console.log(this.formGroupSideWork.getRawValue());

      this.openDialogConfirm();
    } else if (this.formGroupSideWork.disabled) {
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
      ConfirmDialogComponent,
      configDialog
    );
    //หลังปิด dialog
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((confirmStatus: boolean) => {
        if (confirmStatus) {
          this.insertEmit.emit(this.formGroupSideWork.getRawValue());
        }
      });
  }
}
