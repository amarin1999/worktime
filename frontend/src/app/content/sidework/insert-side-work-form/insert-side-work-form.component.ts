import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Message } from "primeng/api";
import { first } from "rxjs/operators";
import { LayoutConstants } from "src/app/shared/constants/LayoutConstants";
import { SideWork } from "src/app/shared/interfaces/sidework";
import { ConfirmDialogComponent } from "../../confirm-dialog/confirm-dialog.component";

@Component({
  selector: "app-insert-side-work-form",
  templateUrl: "./insert-side-work-form.component.html",
  styleUrls: ["./insert-side-work-form.component.scss"]
})
export class InsertSideWorkFormComponent implements OnInit {
  @Input("dateValid") dateValid: { status: boolean };
  @Output() insertEmit: EventEmitter<SideWork> = new EventEmitter();
  @Output() checkDateEmit: EventEmitter<any> = new EventEmitter();
  //constants
  formGrid: string = LayoutConstants.gridFormPrimeNg;
  //form
  formGroupSideWork: FormGroup;
  //message
  msgs: Message[] = [];
  currentDate = new Date();
  minDate = new Date(this.currentDate.setDate(this.currentDate.getDate() - 1));
  maxDate = new Date();

  constructor(
    private buildForm: FormBuilder,
    private dialogConfirm: MatDialog
  ) {}

  ngOnInit(): void {
    this.createFormSideWork();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setFormDate();
  }

  //สร้าง form
  createFormSideWork(): void {
    this.formGroupSideWork = this.buildForm.group(
      {
        date: [null, [Validators.required]],
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

  setFormDate(): void {
    this.msgs = [];
    if (this.dateValid.status) {
      this.msgs.push({
        severity: "warn",
        summary: "แจ้งเตือน",
        detail:
          "คุณได้ลงเวลาสำหรับวันนี้ไปแล้ว หากต้องการแก้ไขไปที่ประวัติการลงเวลา"
      });
      this.formGroupSideWork.get("date").setValue(null);
    }
  }
  checkDate(event: HTMLInputElement): void {
    this.checkDateEmit.emit(event.value);
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
          this.insertEmit.emit(this.formGroupSideWork.getRawValue());
        }
      });
  }
}
