import { EmployeeService } from './../../../shared/service/employee.service';
import { CalendarService } from 'src/app/shared/service/calendar.service';
import {
  Component,
  ViewChild,
  AfterViewInit,
  OnInit,
  SimpleChanges,
  Input,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EmployeeByDay } from 'src/app/shared/interfaces/employee-by-day';
import { EmployeeByDayService } from 'src/app/shared/service/employee-by-day.service';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
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
import { WorkTypePipe } from 'src/app/shared/pipe/work-type.pipe';
import { ShowLeaveEmpByDayComponent } from '../show-leave-emp-by-day/show-leave-emp-by-day.component';

@Component({
  selector: 'app-show-emp-by-day',
  templateUrl: './show-emp-by-day.component.html',
  styleUrls: ['./show-emp-by-day.component.scss'],
})
export class ShowEmpByDayComponent implements OnInit, AfterViewInit {
  @ViewChild('dt') table: Table;
  employeeList: EmployeeByDay[];
  formGroupEmp: FormGroup;
  workAnyWhereSelect: any;
  dataList: any;
  dataSource: any;
  accessReport: any;

  leaveSource: any;
  leaveArray = [];
  isLoading = true;

  dateCilckValue: Date;
  searchId: number;
  formGrid: string = LayoutConstants.gridFormPrimeNg;
  empListClickCheck: number;
  cols: any[];

  fulldate: any;
  year543: any;
  year: any;
  month: any;
  day: any;
  constructor(
    private empService: EmployeeByDayService,
    private dialogRef: MatDialogRef<SideWorkComponent>,
    private buildForm: FormBuilder,
    private dialog: MatDialog,
    private messageService: MessageService,
    private workAnyWherePipe: WorkTypePipe,
    private calendarService: CalendarService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.empListClickCheck = this.dialogRef.componentInstance.dataForm[
      'empListClickCheck'
    ];
    this.fulldate = this.dialogRef.componentInstance.dataForm.date;

    this.createFormEmp();
    this.checkAccessReport();
    this.qureyEmployeeByDay();
    this.checkDataLoadingLeave();

    this.cols = [
      {
        field: 'employeeNo',
        header: 'รหัสพนักงาน',
        headerClass: 'empNo',
        class: 'empNo',
      },
      {
        field: 'firstname',
        header: 'ชื่อ',
        headerClass: 'empFirstName',
        class: 'empFirstName',
      },
      {
        field: 'lastname',
        header: 'นามสกุล',
        headerClass: 'empLastName',
        class: 'empLastName',
      },
      {
        field: 'workAnywhere',
        header: 'ประเภท',
        type: this.workAnyWherePipe,
        headerClass: 'empType',
        class: 'empType',
      },
      {
        field: 'remark',
        header: 'หมายเหตุ',
        headerClass: 'empRemark',
        class: 'empRemark',
      },
      // { field: 'lastUpdateTime', header: 'บันทึกล่าสุด' }
    ];
  }

  ngAfterViewInit() {}

  createFormEmp(): void {
    this.formGroupEmp = this.buildForm.group({
      workAnyWhere: [4],
    });
  }

  checkAccessReport() {
    this.employeeService
      .getEmployeeByID(localStorage.getItem('employeeNo'))
      .subscribe((res) => {
        this.accessReport = res.data[0].accessReport;
      });
  }

  // ค้นหา
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource = filterValue.trim().toLowerCase();
  }

  checkDataLoadingLeave() {
    var loading = setInterval(() => {
      if (!this.calendarService.requestLeavEmpYear) {
      } else {
        clearInterval(loading);
        this.isLoading = false
      }
    }, 2000);
  }

  workAnyWhereClick() {
    this.year = this.dialogRef.componentInstance.dataForm.date.getUTCFullYear();
    this.month = this.dialogRef.componentInstance.dataForm.date.getMonth() + 1;
    this.day = this.dialogRef.componentInstance.dataForm.date.getDate();

    if (this.formGroupEmp.get('workAnyWhere').value == 1) {
      this.workAnyWhereSelect = 1;
    } else if (this.formGroupEmp.get('workAnyWhere').value == 2) {
      this.workAnyWhereSelect = 2;
    } else if (this.formGroupEmp.get('workAnyWhere').value == 3) {
      this.workAnyWhereSelect = 3;
    } else if (this.formGroupEmp.get('workAnyWhere').value == 0) {
      this.workAnyWhereSelect = 0;
    }

    this.empService
      .getEmployeeByDay(
        this.year,
        this.month,
        this.day,
        this.workAnyWhereSelect
      )
      .subscribe((list) => {
        this.employeeList = list;
        this.dataList = new MatTableDataSource<EmployeeByDay>(
          this.employeeList
        );
        this.dataSource = this.dataList._data._value.data;
      });
  }

  employeeListClick() {
    this.year = this.dialogRef.componentInstance.dataForm.date.getUTCFullYear();
    this.month = this.dialogRef.componentInstance.dataForm.date.getMonth() + 1;
    this.day = this.dialogRef.componentInstance.dataForm.date.getDate();

    if (this.formGroupEmp.get('workAnyWhere').value == 4) {
      this.workAnyWhereSelect = 4;
    }

    this.empService
      .getEmployeeAllByDay(this.year, this.month, this.day)
      .subscribe((list) => {
        this.employeeList = list;
        this.dataList = new MatTableDataSource<EmployeeByDay>(
          this.employeeList
        );
        this.dataSource = this.dataList._data._value.data;
      });
  }

  qureyEmployeeByDay() {
    this.year = this.dialogRef.componentInstance.dataForm.date.getUTCFullYear();
    this.month = this.dialogRef.componentInstance.dataForm.date.getMonth() + 1;
    this.day = this.dialogRef.componentInstance.dataForm.date.getDate();

    this.year543 = this.year + 543;

    this.empService
      .getEmployeeAllByDay(this.year, this.month, this.day)
      .subscribe((list) => {
        this.employeeList = list;
        this.dataList = new MatTableDataSource<EmployeeByDay>(
          this.employeeList
        );
        this.dataSource = this.dataList._data._value.data;
      });
  }

  showDialogLeaveEmp() {
    const configDialog: MatDialogConfig<any> = {
      width: '800px',
      disableClose: false,
      autoFocus: false,
      data: { form: String, date: this.fulldate, workAnyWhere: 1 },
    };
    const dialogRef = this.dialog.open(
      ShowLeaveEmpByDayComponent,
      configDialog
    );
  }
  insertTime() {
    const date = this.dialogRef.componentInstance.dataForm.date;

    this.dateCilckValue = date;
    this.openDialogInsert('add');
    this.dialogRef.close();
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
