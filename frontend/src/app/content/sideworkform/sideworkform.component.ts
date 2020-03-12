import { Component, OnInit } from "@angular/core";
import {
  MatDialogRef,
  MatDialog,
  MatDialogConfig
} from "@angular/material/dialog";
import { LayoutConstants } from "src/app/shared/constants/LayoutConstants";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormGroupDirective,
  FormControl,
  NgForm
} from "@angular/forms";
import { SideworkService } from "src/app/shared/service/sidework.service";
import { EmployeeService } from "src/app/shared/service/employee.service";
import { ConfirmdialogComponent } from "../confirmdialog/confirmdialog.component";

@Component({
  selector: "app-sideworkform",
  templateUrl: "./sideworkform.component.html",
  styleUrls: ["./sideworkform.component.scss"]
})
export class SideworkformComponent implements OnInit {
  formGrid = LayoutConstants.gridFormPrimeNg;
  formGroupSideWork: FormGroup;
  imgLogo: string = LayoutConstants.sideWorkImagePath;
  employeeNo: string;
  constructor(
    public dialogRef: MatDialogRef<SideworkformComponent>,
    public build: FormBuilder,
    public sideworkService: SideworkService,
    public employeeService: EmployeeService,
    public dialogConfirm: MatDialog
  ) {}

  ngOnInit(): void {
    this.employeeService
      .getEmployeeOnline()
      .subscribe(res => (this.employeeNo = res.no));
    this.buildForm();
  }

  buildForm(): void {
    //สร้างform
    this.formGroupSideWork = this.build.group(
      {
        startTime: [new Date(), [Validators.required]],
        endTime: ["", [Validators.required]],
        workAnyTime: ["", [Validators.maxLength(10)]],
        remark: ["", [Validators.maxLength(200)]]
      },
      {
        validators: [this.compareTime]
      }
    );
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

  insertSidework(): void {
    const request = {
      ...this.formGroupSideWork.getRawValue(),
      employeeNo: localStorage.getItem("employeeId")
    };
    console.log({ request });
    this.sideworkService.addSidework(request).subscribe(response => {
      console.log({ response });
      this.dialogRef.close();
    });
    // this.dialogRef.close("this.formGroupSideWork.value");
  }
}
