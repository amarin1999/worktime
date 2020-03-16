import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef
} from "@angular/material/dialog";
import { NgxSpinnerService } from "ngx-spinner";
import { finalize, take } from "rxjs/operators";
import { LayoutConstants } from "src/app/shared/constants/LayoutConstants";
import { SideWork } from "src/app/shared/interfaces/sidework";
import { SideworkService } from "src/app/shared/service/sidework.service";
import { ConfirmdialogComponent } from "../confirmdialog/confirmdialog.component";
import { MessageService } from "primeng/api";

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
  employeeNo: string = localStorage.getItem("employeeId");

  constructor(
    private dialogRef: MatDialogRef<SideworkformComponent>,
    private build: FormBuilder,
    private sideWorkService: SideworkService,
    private dialogConfirm: MatDialog,
    public spinner: NgxSpinnerService,
    private messageService: MessageService,
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
          this.patchValueForm();
        },
        error => {
          console.table(error);
        }
      );
  }

  patchValueForm(): void {
    if (this.dataSideWork !== null) {
      this.formGroupSideWork.patchValue({
        startTime: this.setStartTime(),
        endTime: this.setEndTime(),
        workAnyWhere: this.dataSideWork.workAnyWhere,
        remark: this.dataSideWork.remark
      });
    }
  }
  buildForm(): void {
    this.formGroupSideWork = this.build.group(
      {
        startTime: [new Date(), [Validators.required]],
        endTime: [null],
        workAnyWhere: [false, [Validators.maxLength(10)]],
        remark: [null, [Validators.maxLength(200)]]
      },
      {
        validators: [this.compareTime]
      }
    );
  }

  setStartTime() {
    return this.dataSideWork.startTime
      ? new Date(this.dataSideWork.startTime)
      : new Date();
  }
  setEndTime() {
    return this.dataSideWork.endTime
      ? new Date(this.dataSideWork.endTime)
      : this.dataSideWork.startTime
      ? new Date()
      : null;
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

  onSubmit(): void {
    //ถ้า validate ผ่าน
    if (this.formGroupSideWork.valid) {
      this.openDialogConfirm();
    }
  }

  insertSidework(): void {
    const request = {
      ...this.formGroupSideWork.getRawValue(),
      employeeNo: this.employeeNo
    };
    console.log({ request });
    this.sideWorkService.addSidework(request).subscribe(response => {
      console.log({ response });
      this.dialogRef.close();
    });
    // this.dialogRef.close("this.formGroupSideWork.value");
  }

  openDialogConfirm(): void {
    //config dialog
    const configDialog: MatDialogConfig<any> = {
      disableClose: true,
      autoFocus: false,
      data: {
        textConfirm: "ยืนยันการเพิ่มข้อมูลเวลาเริ่มงาน ?"
      }
    };
    //เปิด dialog
    const dialogRef = this.dialogConfirm.open(
      ConfirmdialogComponent,
      configDialog
    );
    //หลังปิด dialog
    dialogRef.afterClosed().subscribe(confirmStatus => {
      if (confirmStatus) {
        this.insertSidework();
      }
    });
  }
}
