import { Component, OnInit } from "@angular/core";
import { Employee } from "src/app/shared/interfaces/employee";
import { AuthService } from "src/app/shared/service/auth.service";
import { EmployeeService } from "src/app/shared/service/employee.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit {
  showToggle: boolean = false;
  employee: Employee;

  constructor(
    public authService: AuthService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.employeeService
      .getEmployeeSignOn()
      .subscribe(res => (this.employee = { ...res }));
  }

  signOut(): void {
    this.authService.onSignout();
  }
}
