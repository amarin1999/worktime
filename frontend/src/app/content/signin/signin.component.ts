import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Employee } from 'src/app/shared/interfaces/employee';

import { EmployeeService } from 'src/app/shared/service/employee.service';




@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
 
})

export class SigninComponent implements OnInit {

  form: FormGroup;


  constructor(
    private builder: FormBuilder,
    private employeeService: EmployeeService,
    private route: Router,
    
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.builder.group({
      'employeeId': ['', [Validators.required, Validators.maxLength(45)]],
    })
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.employeeService.getEmployee(this.form.get('employeeId').value).subscribe(response => {
      const employee: Employee = response.data;
      if (employee) {
        console.table(response);
        localStorage.setItem('employeeId', employee.no);
        this.route.navigate(['']);
      }else{
        // this.messageService.add({key: 'tl', severity:'success', summary: 'Summary Text', detail: 'Detail Text'});
      }
    })

  }

}
