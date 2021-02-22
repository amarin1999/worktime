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

  check(event) {
    const value = this.form.value.userID;
    if (this.form.value.userID.length != 6) {
      // console.log(this.form.value.userID.length)
    }
    // console.log(this.form.value.userID)
  }

  onSubmit(): void {
    if (this.form.value.password === '' && this.form.value.userID === '') {
      this.messageService.add({
        key: 'errorMessage',
        severity: 'error',
        summary: 'ผิดพลาด',
        detail: 'กรุณากรอกรหัสพนักงานและพาสเวิร์ด',
      });
      return;
    }
    if (this.form.value.userID === '') {
      this.messageService.add({
        key: 'errorMessage',
        severity: 'error',
        summary: 'ผิดพลาด',
        detail: 'กรุณากรอกรหัสพนักงาน',
      });
      return;
    }
    if (this.form.value.password === '') {
      this.messageService.add({
        key: 'errorMessage',
        severity: 'error',
        summary: 'ผิดพลาด',
        detail: 'กรุณากรอกพาสเวิร์ด',
      });
      return;
    }
    if (this.form.valid) {
      this.spinner.show();
      this.employeeService.getEmployee(this.form.get('userID').value).subscribe(
        (response: Response) => {
          this.authenService
            .checkAuthen(this.form.value)
            .pipe(
              first(),
              finalize(() => {
                this.spinner.hide();
              })
            )
            .subscribe((res) => {
              if (res == true) {
                const employee: Employee = response.data;
                if (employee) {
                  localStorage.setItem('employeeNo', employee.no);
                  this.route.navigate(['main/sidework-calendar']);
                }
              } else {
                this.messageService.clear();
                this.messageService.add({
                  key: 'errorMessage',
                  severity: 'error',
                  summary: 'ผิดพลาด',
                  detail: 'พาสเวิร์ดไม่ถูกต้อง',
                });
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
            detail: error.error.errorMessage,
          });
        }
      );
    }
  }
}
