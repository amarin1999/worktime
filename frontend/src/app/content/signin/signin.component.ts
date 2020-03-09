import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EmployeeService } from 'src/app/shared/service/employee.service';



@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  form: FormGroup;


  constructor(
    private builder: FormBuilder,
    private employeeService: EmployeeService
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
      if (response.data) {
        console.log({ response });
      }

    })

  }

}
