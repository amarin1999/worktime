import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef
} from "@angular/material/dialog";
import { NgxSpinnerService } from "ngx-spinner";
import { take, finalize } from "rxjs/operators";
import { LayoutConstants } from "src/app/shared/constants/LayoutConstants";
import { SideWork } from "src/app/shared/interfaces/sidework";
import { EmployeeService } from "src/app/shared/service/employee.service";
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
  employeeNo: string = localStorage.getItem("employeeId");

  constructor(
    private dialogRef: MatDialogRef<SideworkformComponent>,
    private build: FormBuilder,
    private sideWorkService: SideworkService,
    private employeeService: EmployeeService,
    private dialogConfirm: MatDialog,
    public spinner: NgxSpinnerService
  ) {
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
          console.table({ res });
          this.dataSideWork = res.data;
        },
        error => {
          console.table(error);
        }
      );
    this.buildForm();
  }

  buildForm(): void {
    //สร้างform
    if (this.dataSideWork != null) {
      this.formGroupSideWork = this.build.group(
        {
          startTime: [
            this.dataSideWork.startTime
              ? this.dataSideWork.startTime
              : new Date(),
            [Validators.required]
          ],
          endTime: [
            this.dataSideWork.endTime
              ? this.dataSideWork.endTime
              : this.dataSideWork.startTime
              ? new Date()
              : null
            // [Validators.required]
          ],
          workAnyWhere: [false],
          remark: [null, [Validators.maxLength(200)]]
        },
        {
          validators: [this.compareTime]
        }
      );
    } else {
      this.formGroupSideWork = this.build.group(
        {
          startTime: [new Date(), [Validators.required]],
          endTime: [null],
          workAnyWhere: [false],
          remark: [null, [Validators.maxLength(200)]]
        },
        {
          validators: [this.compareTime]
        }
      );
    }
  }

  compareTime(group: FormGroup): void {
    let startTime = group.get("startTime").value;
    let endTime = group.get("endTime").value;
    if (startTime > endTime) {
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
