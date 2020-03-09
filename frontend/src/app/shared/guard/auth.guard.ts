import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EmployeeService } from '../service/employee.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private employeeService: EmployeeService
  ) {
    console.log('fasdsadf');
  }

  auth() {
    const employeeId: string = localStorage.getItem('employeeId');
    return new Promise((resolve, reject) => {
      if (employeeId) {
        this.employeeService.getEmployee(employeeId)
          .toPromise()
          .then(res => {
            if (res['status'] === 'Success') {
              // this.authService.isLoggedIn().next(true);
              // this.authService.setRole(res['data']['0']['roleName']);
              // localStorage.setItem('userId', res['data'][0]['id']);
              return resolve(true);
            } else {
              // this.authService.isLoggedIn().next(false);
              return reject(false);
            }
          }).catch((error) => {
            // localStorage.removeItem('access-token');
            console.table(error);
            // this.authService.isLoggedIn().next(false);
            return reject(false);
          });
      } else {
        // this.authService.isLoggedIn().next(false);
        return reject(false);
      }
    });
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {

    return this.auth().then(() => {
      console.log(true);
      return true;
    }).catch(() => {
      console.log(false);
      this.router.navigate(['/signin']);
      return false;
    });
  }

}
