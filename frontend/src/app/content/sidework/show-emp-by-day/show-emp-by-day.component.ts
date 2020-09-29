import { Component, ViewChild, AfterViewInit, OnInit, SimpleChanges, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from "@angular/material/sort";
import { EmployeeByDay } from 'src/app/shared/interfaces/employee-by-day';
import { EmployeeByDayService } from 'src/app/shared/service/employee-by-day.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SideWorkComponent } from '../sidework.component';
import { Subject, Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LayoutConstants } from 'src/app/shared/constants/LayoutConstants';
import { Injectable } from '@angular/core';
import { Table } from 'primeng/table';
import { SideworkCalendarComponent } from '../../sidework-calendar/sidework-calendar.component';
import { SideWork } from 'src/app/shared/interfaces/sidework';
import { SideWorkService } from 'src/app/shared/service/sidework.service';
import { MessageService } from 'primeng/api';
import { first } from 'rxjs/operators';


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
  
  dateCilckValue: Date;
  searchId: number;
  formGrid: string = LayoutConstants.gridFormPrimeNg;
  empListClickCheck:number;
  cols: any[];

  year: any;
  month: any;
  day: any;
  constructor(
    private empService: EmployeeByDayService,
    private dialogRef: MatDialogRef<SideWorkComponent>,
    private buildForm: FormBuilder,
    private dialog: MatDialog,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.empListClickCheck = this.dialogRef.componentInstance.dataForm["empListClickCheck"];
    this.createFormEmp();
    this.qureyEmployeeByDay();

    this.cols = [
      { field: 'employeeNo', header: 'รหัสพนักงาน' },
      { field: 'firstname', header: 'ชื่อ' },
      { field: 'lastname', header: 'นามสกุล' },
      { field: 'remark', header: 'หมายเหตุ' }
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
    this.year = this.dialogRef.componentInstance.dataForm.date.getUTCFullYear();
    this.month = this.dialogRef.componentInstance.dataForm.date.getUTCMonth() + 1;
    this.day = this.dialogRef.componentInstance.dataForm.date.getUTCDate() + 1;

    if (this.formGroupEmp.get('workAnyWhere').value == 1) {
      this.workAnyWhereSelect = 1;
    } else if (this.formGroupEmp.get('workAnyWhere').value == 2) {
      this.workAnyWhereSelect = 2;
    } else if (this.formGroupEmp.get('workAnyWhere').value == 3) {
      this.workAnyWhereSelect = 3;
    } else if (this.formGroupEmp.get('workAnyWhere').value == 4) {
      this.workAnyWhereSelect = 4;
    }

    this.empService.getEmployeeByDay(this.year, this.month, this.day, this.workAnyWhereSelect).subscribe((list) => {
      this.employeeList = list;
      this.dataList = new MatTableDataSource<EmployeeByDay>(this.employeeList);
      this.dataSource = this.dataList._data._value.data;
    })
  }


  qureyEmployeeByDay() {
    this.year = this.dialogRef.componentInstance.dataForm.date.getUTCFullYear();
    this.month = this.dialogRef.componentInstance.dataForm.date.getUTCMonth() + 1;
    this.day = this.dialogRef.componentInstance.dataForm.date.getUTCDate() + 1;

    this.empService.getEmployeeByDay(this.year, this.month, this.day, 1).subscribe((list) => {
      this.employeeList = list;
      this.dataList = new MatTableDataSource<EmployeeByDay>(this.employeeList);
      this.dataSource = this.dataList._data._value.data;
    })
  }

  insertTime() {
    const date = this.dialogRef.componentInstance.dataForm.date;
    
    this.dateCilckValue = date;
    this.openDialogInsert('add');
    this.dialogRef.close()
  }

  openDialogInsert(type: string): void {

    const configDialog: MatDialogConfig<any> = {
      disableClose: false,
      autoFocus: false,
      data: { type, dateClickValue: this.dateCilckValue },
    };
    const dialogRef = this.dialog.open(SideWorkComponent, configDialog);

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(
        (result) => {
          if (result.status === 'Success') {
            this.messageService.clear();
            this.messageService.add({
              key: 'SuccessMessage',
              severity: 'success',
              summary: 'ข้อความ',
              detail: 'ลงเวลาเรียบร้อยแล้ว',
            });
          } else if (result.error) {
            this.messageService.clear();
            this.messageService.add({
              key: 'errorMessage',
              severity: 'error',
              summary: 'ข้อความ',
              detail: result.error.errorMessage,
            });
          }
        },
        (error) => {
          this.messageService.clear();
          this.messageService.add({
            key: 'errorMessage',
            severity: 'error',
            summary: 'ข้อความ',
            detail: 'เกิดข้อผิดพลาดระหว่างเพิ่มข้อมูล',
          });
        }
      );
  }
}


