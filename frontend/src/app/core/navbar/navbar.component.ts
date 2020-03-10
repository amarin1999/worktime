import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/service/auth.service';
import { EmployeeService } from 'src/app/shared/service/employee.service';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/shared/interfaces/employee';
import { map } from 'rxjs/operators';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  showToggle: boolean = false;
  employee: Employee;

  constructor(
    public authService: AuthService,
    private employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
   this.employeeService.getEmployee(localStorage.getItem('employeeId')).subscribe(res => this.employee = res.data);
   console.log(this.employee);
  }

  onSignOut(): void {
    this.authService.logout();
  }
}
