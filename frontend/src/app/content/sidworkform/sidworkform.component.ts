import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { LayoutConstants } from "src/app/shared/constants/LayoutConstants";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as moment from "moment";
import { SideworkService } from "src/app/shared/service/sidework.service";
import { EmployeeService } from "src/app/shared/service/employee.service";

@Component({
  selector: "app-sidworkform",
  templateUrl: "./sidworkform.component.html",
  styleUrls: ["./sidworkform.component.scss"]
})
export class SidworkformComponent implements OnInit {
  formGrid = LayoutConstants.gridFormPrimeNg;
  formGroupSideWork: FormGroup;
  imgLogo: string = LayoutConstants.sideWorkImagePath;

  constructor(
    public dialogRef: MatDialogRef<SidworkformComponent>,
    public build: FormBuilder,
    public sideworkService: SideworkService,
    public employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.formGroupSideWork = this.build.group({
      startTime: ["", [Validators.required]],
      endTime: ["", [Validators.required]],
      workAnytime: ["", [Validators.required, Validators.maxLength(10)]],
      remark: ["", [Validators.required, Validators.maxLength(10)]]
    });
  }

  onSubmit(): void {
    console.log(this.formGroupSideWork.getRawValue());
    console.log(
      this.formGroupSideWork.get("startTime").value >
        this.formGroupSideWork.get("endTime").value
    );
    if (this.formGroupSideWork.valid) {
      this.sideworkService
        .addSidework(this.formGroupSideWork.getRawValue())
        .subscribe(res => {
          console.log("res", res);
        });
      this.dialogRef.close("this.formGroupSideWork.value");
    }
  }
}
