import { AuthService } from 'src/app/shared/service/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { finalize, first } from 'rxjs/operators';
import { LayoutConstants } from 'src/app/shared/constants/LayoutConstants';
import { Employee } from 'src/app/shared/interfaces/employee';
import { EmployeeService } from 'src/app/shared/service/employee.service';
import { Response } from 'src/app/shared/interfaces/response';
import { SideworkCalendarComponent } from '../sidework-calendar/sidework-calendar.component';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  providers: [MessageService],
})
export class SignInComponent implements OnInit {
  cdgImagePath: string = LayoutConstants.cdgImagePath;
  form: FormGroup;
  sideworkCalendar: SideworkCalendarComponent;
  hide = true;

  constructor(
    private builder: FormBuilder,
    private employeeService: EmployeeService,
    private authenService: AuthService,
    private route: Router,
    private messageService: MessageService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.builder.group({
      userID: ['', [Validators.required, Validators.maxLength(10)]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.form.value.userID === '' && this.form.value.password === '') {
      this.messageService.clear();
      this.messageService.add({
        key: 'errorMessage',
        severity: 'error',
        summary: 'คำเตือน',
        detail: 'กรุณากรอกรหัสพนักงานและรหัสผ่าน',
      });
      return;
    }
    if (this.form.value.userID === '') {
      this.messageService.clear();
      this.messageService.add({
        key: 'errorMessage',
        severity: 'error',
        summary: 'คำเตือน',
        detail: 'กรุณากรอกรหัสพนักงาน',
      });
      return;
    }
    if (this.form.value.password === '') {
      this.messageService.clear();
      this.messageService.add({
        key: 'errorMessage',
        severity: 'error',
        summary: 'คำเตือน',
        detail: 'กรุณากรอกรหัสผ่าน',
      });
      return;
    }
    if (this.form.valid) {
      this.spinner.show();
      this.employeeService
        .getEmployeeByID(this.form.get('userID').value)
        .subscribe(
          (response: Response) => {
            this.authenService
              .checkAuthen(this.form.value)
              .pipe(
                finalize(() => {
                  this.spinner.hide();
                })
              )
              .subscribe((res) => {
                const employee: Employee = response.data;
                if (res == true) {
                  if (employee) {
                    localStorage.setItem('employeeNo', employee[0].no);
                    this.route.navigate(['main/sidework-calendar']);
                  }
                } else {
                  // this.form.controls.password.setErrors({incorrent: true});
                  this.messageService.clear();
                  this.messageService.add({
                    key: 'errorMessage',
                    severity: 'error',
                    summary: 'คำเตือน',
                    detail: 'รหัสพนักงานหรือรหัสผ่านไม่ถูกต้อง',
                  });
                  return;
                }
              });
          },
          (error) => {
            this.spinner.hide();
            this.messageService.clear();
            this.messageService.add({
              key: 'errorMessage',
              severity: 'error',
              summary: 'ผิดพลาด',
              // detail: error.error.errorMessage,
              detail: 'รหัสพนักงานหรือรหัสผ่านไม่ถูกต้อง',
            });
            return;
          }
        );
    }
  }
}
