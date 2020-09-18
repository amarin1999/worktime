import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EmployeeByDay } from 'src/app/shared/interfaces/employee-by-day';
import { EmployeeByDayService } from 'src/app/shared/service/employee-by-day.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SideWorkComponent } from '../sidework.component';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-show-emp-by-day',
  templateUrl: './show-emp-by-day.component.html',
  styleUrls: ['./show-emp-by-day.component.scss']
})
export class ShowEmpByDayComponent implements OnInit {
  displayedColumns: string[] = ['employeeNo', 'firstname', 'lastname', 'workAnywhere'];
  employeeList: EmployeeByDay[];
  formGroupEmp: FormGroup;
  workAnyWhereSelect: any;
  dataSource = new MatTableDataSource<EmployeeByDay>();


  constructor(
    private empService: EmployeeByDayService,
    private dialogRef: MatDialogRef<SideWorkComponent>,
    private buildForm: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.createFormEmp();
    this.qureyEmployeeByDay();
  }

  createFormEmp(): void {
    this.formGroupEmp = this.buildForm.group({
      workAnyWhere: [1],
    })
  }

  workAnyWhereClick() {
    const year = this.dialogRef.componentInstance.dataForm.date.getUTCFullYear();
    const month = this.dialogRef.componentInstance.dataForm.date.getUTCMonth() + 1;
    const day = this.dialogRef.componentInstance.dataForm.date.getUTCDate() + 1;

    if (this.formGroupEmp.get('workAnyWhere').value == 1) {
      this.workAnyWhereSelect = 1;
    } else if (this.formGroupEmp.get('workAnyWhere').value == 2) {
      this.workAnyWhereSelect = 2;
    } else if (this.formGroupEmp.get('workAnyWhere').value == 3) {
      this.workAnyWhereSelect = 3;
    } else if (this.formGroupEmp.get('workAnyWhere').value == 4) {
      this.workAnyWhereSelect = 4;
    }

    this.empService.getEmployeeByDay(year, month, day, this.workAnyWhereSelect).subscribe((list) => {
      this.employeeList = list;
      this.dataSource = new MatTableDataSource<EmployeeByDay>(this.employeeList);
    })
  }


  qureyEmployeeByDay() {
    const year = this.dialogRef.componentInstance.dataForm.date.getUTCFullYear();
    const month = this.dialogRef.componentInstance.dataForm.date.getUTCMonth() + 1;
    const day = this.dialogRef.componentInstance.dataForm.date.getUTCDate() + 1;

    this.empService.getEmployeeByDay(year, month, day, 1).subscribe((list) => {
      this.employeeList = list;
      this.dataSource = new MatTableDataSource<EmployeeByDay>(this.employeeList);
      // this.dataSource.paginator = this.paginator;
    })
  }
}


