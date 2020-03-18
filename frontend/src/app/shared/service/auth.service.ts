import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { Employee } from "../interfaces/employee";
import { EmployeeService } from "./employee.service";

@Injectable()
export class AuthService {
  private signin = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  onSignin(employeeId: string): boolean {
    try {
      this.employeeService.getEmployee(employeeId).subscribe(res => {
        const employee: Employee = res.data;
        if (employee) {
          this.signin.next(true);
        } else {
          this.signin.next(false);
        }
      });
      return true;
    } catch (error) {
      console.table(error);
      throw error;
    }
  }

  isSignIn(): BehaviorSubject<boolean> {
    return this.signin;
  }

  onSignout(): void {
    localStorage.clear();
    this.signin.next(false);
    this.router.navigate(["signin"]);
  }
}
