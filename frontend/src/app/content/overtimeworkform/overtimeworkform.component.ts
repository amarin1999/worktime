import { Component, OnInit } from "@angular/core";
import { LayoutConstants } from "src/app/shared/constants/LayoutConstants";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-overtimeworkform",
  templateUrl: "./overtimeworkform.component.html",
  styleUrls: ["./overtimeworkform.component.scss"]
})
export class OvertimeworkformComponent implements OnInit {
  formGrid: string = LayoutConstants.gridFormPrimeNg;
  imgLogo: string = LayoutConstants.sideWorkImagePath;
  formGroupOvertimeWork: FormGroup;

  constructor(private buildFormOvertimeWork: FormBuilder) {
    this.buildForm();
  }

  ngOnInit(): void {}

  buildForm(): void {
    this.formGroupOvertimeWork = this.buildFormOvertimeWork.group(
      {
        startTime: [new Date(), [Validators.required]],
        endTime: [null],
        workProject: [null, [Validators.maxLength(45)]],
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
  onSubmit(): void {}
}
