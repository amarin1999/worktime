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
  employee: Observable<Employee>;

  constructor(
    public authService: AuthService,
    private employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    this.employee = this.employeeService.getEmployee(localStorage.getItem('employeeId')).pipe(map(res => res.data));
  }

  onSignOut(): void {
    this.authService.logout();
  }
}
