import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { finalize, first } from "rxjs/operators";
import { LayoutConstants } from "src/app/shared/constants/LayoutConstants";
import { Employee } from "src/app/shared/interfaces/employee";
import { EmployeeService } from "src/app/shared/service/employee.service";
import { Response } from "src/app/shared/interfaces/response";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"]
})
export class SignInComponent implements OnInit {
  cdgImagePath: string = LayoutConstants.cdgImagePath;
  form: FormGroup;

  constructor(
    private builder: FormBuilder,
    private employeeService: EmployeeService,
    private route: Router,
    private messageService: MessageService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.builder.group({
      employeeId: ["", [Validators.required, Validators.maxLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.spinner.show();
      this.employeeService
        .getEmployee(this.form.get("employeeId").value)
        .pipe(
          first(),
          finalize(() => {
            this.spinner.hide();
          })
        )
        .subscribe(
          (response: Response) => {
            const employee: Employee = response.data;
            if (employee) {
              localStorage.setItem("employeeNo", employee.no);
              this.route.navigate(["main"]);
            }
          },
          error => {
            this.messageService.clear();
            this.messageService.add({
              key: "errorMessage",
              severity: "error",
              summary: "ผิดพลาด",
              detail: error.error.errorMessage
            });
          }
        );
    }
  }
}
