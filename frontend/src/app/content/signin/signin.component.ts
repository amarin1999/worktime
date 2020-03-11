import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { Employee } from 'src/app/shared/interfaces/employee';
import { EmployeeService } from 'src/app/shared/service/employee.service';



@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],

})

export class SigninComponent implements OnInit {
  @Output() statusLoading = new EventEmitter<boolean>();
  form: FormGroup;


  constructor(
    private builder: FormBuilder,
    private employeeService: EmployeeService,
    private route: Router,
    private messageService: MessageService,
    private spinner: NgxSpinnerService

  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.builder.group({
      'employeeId': ['', [Validators.required, Validators.maxLength(10)]],
    })
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.form.valid) {
      this.spinner.show();
      this.employeeService
        .getEmployee(this.form.get('employeeId').value)
        .pipe(finalize(() => this.spinner.hide()))
        .subscribe((response) => {
          const employee: Employee = response.data;
          if (employee) {
            localStorage.setItem('employeeId', employee.no);
            this.route.navigate(['']);
          }
        }, (error) => {
          this.messageService.clear();
          this.messageService.add({ key: 'errorMessage', severity: 'error', summary: 'ผิดพลาด', detail: error.error.errorMessage });
        })
    }

  }

}