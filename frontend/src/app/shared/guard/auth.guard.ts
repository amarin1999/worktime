import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import { Employee } from "../interfaces/employee";
import { AuthService } from "../service/auth.service";
import { EmployeeService } from "../service/employee.service";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    private authService: AuthService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const employeeId: string = localStorage.getItem("employeeNo");

    return this.employeeService
      .getEmployee(employeeId)
      .toPromise()
      .then(res => {
        const employee: Employee = res.data;
        if (employee) {
          this.authService.isSignIn().next(true);
          return true;
        }
       
      })
      .catch(() => {
        this.router.navigate(["signin"]);
        return false;
      });
  }
}
