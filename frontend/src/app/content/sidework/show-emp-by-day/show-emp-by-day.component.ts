import { Component, ViewChild, AfterViewInit, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from "@angular/material/sort";
import { EmployeeByDay } from 'src/app/shared/interfaces/employee-by-day';
import { EmployeeByDayService } from 'src/app/shared/service/employee-by-day.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SideWorkComponent } from '../sidework.component';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LayoutConstants } from 'src/app/shared/constants/LayoutConstants';
import { Injectable } from '@angular/core';
import { Table } from 'primeng/table';


@Component({
  selector: 'app-show-emp-by-day',
  templateUrl: './show-emp-by-day.component.html',
  styleUrls: ['./show-emp-by-day.component.scss']
})
export class ShowEmpByDayComponent implements OnInit, AfterViewInit {
  @ViewChild('dt') table: Table;
  employeeList: EmployeeByDay[];
  formGroupEmp: FormGroup;
  workAnyWhereSelect: any;
  dataList: any;
  dataSource: any;

  formGrid: string = LayoutConstants.gridFormPrimeNg;

  cols: any[];

  constructor(
    private empService: EmployeeByDayService,
    private dialogRef: MatDialogRef<SideWorkComponent>,
    private buildForm: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.createFormEmp();
    this.qureyEmployeeByDay();

    this.cols = [
      { field: 'employeeNo', header: 'รหัสพนักงาน' },
      { field: 'firstname', header: 'ชื่อ' },
      { field: 'lastname', header: 'นามสกุล' },
      { field: 'remark' , header: 'หมายเหตุ' } 
    ];
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
  }

  createFormEmp(): void {
    this.formGroupEmp = this.buildForm.group({
      workAnyWhere: [1],
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
      this.dataList = new MatTableDataSource<EmployeeByDay>(this.employeeList);
      this.dataSource = this.dataList._data._value.data;
    })
  }


  qureyEmployeeByDay() {
    const year = this.dialogRef.componentInstance.dataForm.date.getUTCFullYear();
    const month = this.dialogRef.componentInstance.dataForm.date.getUTCMonth() + 1;
    const day = this.dialogRef.componentInstance.dataForm.date.getUTCDate() + 1;

    this.empService.getEmployeeByDay(year, month, day, 1).subscribe((list) => {
      this.employeeList = list;
      this.dataList = new MatTableDataSource<EmployeeByDay>(this.employeeList);
      this.dataSource = this.dataList._data._value.data;
    })
  }
}


