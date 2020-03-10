import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Employee } from '../interfaces/employee';
import { EmployeeService } from './employee.service';


@Injectable()
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private employeeService: EmployeeService
  ) { }


  login(employeeId: string): boolean {
    try {
      this.employeeService.getEmployee(employeeId).subscribe(res => {
        const employee: Employee = res.data;
        if (employee) {          
          this.loggedIn.next(true);
        } else {
          this.loggedIn.next(false);
        }
      })
      return true;
    } catch (error) {
      console.table(error);
      throw (error);
    }
  }

  isLoggedIn(): BehaviorSubject<boolean> {
    return this.loggedIn;
  }

  logout(): void {
    localStorage.clear();
    this.loggedIn.next(false);
    this.router.navigate(['signin']);
  }
}