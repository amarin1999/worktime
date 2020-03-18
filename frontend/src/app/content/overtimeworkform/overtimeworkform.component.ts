import { Component, OnInit } from "@angular/core";
import { LayoutConstants } from "src/app/shared/constants/LayoutConstants";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { OvertimeService } from "src/app/shared/service/overtime.service";

@Component({
  selector: "app-overtimeworkform",
  templateUrl: "./overtimeworkform.component.html",
  styleUrls: ["./overtimeworkform.component.scss"]
})
export class OvertimeworkformComponent implements OnInit {
  formGrid: string = LayoutConstants.gridFormPrimeNg;
  imgLogo: string = LayoutConstants.overtimeImagePath;
  formGroupOvertimeWork: FormGroup;

  constructor(
    private buildForm: FormBuilder,
    private overtimeService: OvertimeService
  ) {
    this.buildFormOvertime();
  }

  ngOnInit(): void {}

  buildFormOvertime(): void {
    this.formGroupOvertimeWork = this.buildForm.group({
      timeRange: new FormArray([]),
      workProject: [null, [Validators.maxLength(45)]],
      remark: [null, [Validators.maxLength(250)]]
    });
  }
  get formTimeRangeData() {
    return <FormArray>this.formGroupOvertimeWork.get("timeRange");
  }

  getTime(): FormArray {
    return this.formGroupOvertimeWork.get("timeRange") as FormArray;
  }

  addTime() {
    const rangeTime = this.buildForm.group(
      {
        startTime: [null, [Validators.required]],
        endTime: [null, [Validators.required]]
      },
      {
        validators: [this.compareTime]
      }
    );
    console.log(this.getTime());
    this.getTime().push(rangeTime);
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
    const requestData = {
      ...this.formGroupOvertimeWork.getRawValue(),
      employeeNo: localStorage.getItem("employeeId")
    };
    this.overtimeService.addOvertimeWork(requestData).subscribe(res => {
      console.log({ res });
    });
  }
}
