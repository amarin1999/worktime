import { NgxSpinnerService } from 'ngx-spinner';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShowEmpByDayComponent } from './../show-emp-by-day/show-emp-by-day.component';
import { CalendarService } from 'src/app/shared/service/calendar.service';
import {
  Component,
  ViewChild,
  AfterViewInit,
  OnInit,
  SimpleChanges,
  Input,
  Inject,
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

@Component({
  selector: 'app-show-leave-emp-by-day',
  templateUrl: './show-leave-emp-by-day.component.html',
  styleUrls: ['./show-leave-emp-by-day.component.scss']
})
export class ShowLeaveEmpByDayComponent implements OnInit {
  @ViewChild('dt') table: Table;
  employeeList: EmployeeByDay[];
  formGroupEmp: FormGroup;
  workAnyWhereSelect: any;
  dataList: any;
  dataSource: any;

  leaveSource: any;
  leaveArray = [];

  dateCilckValue: Date;
  searchId: number;
  formGrid: string = LayoutConstants.gridFormPrimeNg;
  cols: any[];

  year543: any;
  year: any;
  month: any;
  day: any;
  constructor(
    private empService: EmployeeByDayService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private buildForm: FormBuilder,
    private dialog: MatDialog,
    private messageService: MessageService,
    private workAnyWherePipe: WorkTypePipe,
    private spinner: NgxSpinnerService,
    private calendarService: CalendarService,
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.createFormEmp();
    this.qureyEmployeeByDay();

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
  // ค้นหา
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource = filterValue.trim().toLowerCase();
  }

  qureyEmployeeByDay() {
    this.year = this.data.date.getUTCFullYear();
    this.month = this.data.date.getMonth() + 1;
    this.day = this.data.date.getDate();

    this.year543 = this.year + 543;
    this.dataSource = [];
    this.calendarService.storeLeaveEmployee.subscribe((res) => {
      const currentMonth = ('0' + this.month).slice(-2) ;
      const currentDay = ('0' + this.day).slice(-2) ;
      if (res.length != 0) {
        for (let i = 0; i < res.length; i++) {
          // @ts-ignore
          if (res[i].start === this.year + '-' + currentMonth + '-' + currentDay) {
            // @ts-ignore
            if (res[i].type === 'PERS') {
              // @ts-ignore
              res[i].workAnywhere = 'PERS'; } else if (res[i].type === 'SICK') {
              // @ts-ignore
              res[i].workAnywhere = 'SICK'; } else if (res[i].type === 'VACA') {
              // @ts-ignore
              res[i].workAnywhere = 'VACA'; }
            this.dataSource.push(res[i]);
          }
        }
        this.spinner.hide();
      }
    });

  }

  selectEmployeeViaCondition() {
    if (this.formGroupEmp.get('workAnyWhere').value === '0') {
      this.dataSource = [];
      this.calendarService.storeLeaveEmployee.subscribe((res) => {
        const currentMonth = ('0' + this.month).slice(-2) ;
        const currentDay = ('0' + this.day).slice(-2) ;
        if (res.length != 0) {
          for (let i = 0; i < res.length; i++) {
            // @ts-ignore
            if (res[i].start === this.year + '-' + currentMonth + '-' + currentDay && res[i].type === 'VACA') {
              // @ts-ignore
              if (res[i].type === 'PERS') {
                // @ts-ignore
                res[i].workAnywhere = 'PERS'; } else if (res[i].type === 'SICK') {
                // @ts-ignore
                res[i].workAnywhere = 'SICK'; } else if (res[i].type === 'VACA') {
                // @ts-ignore
                res[i].workAnywhere = 'VACA'; }
              this.dataSource.push(res[i]);
            }
          }
          this.spinner.hide();
        }
      });
    } else if (this.formGroupEmp.get('workAnyWhere').value === '1') {
      this.dataSource = [];
      this.calendarService.storeLeaveEmployee.subscribe((res) => {
        const currentMonth = ('0' + this.month).slice(-2) ;
        const currentDay = ('0' + this.day).slice(-2) ;
        if (res.length != 0) {
          for (let i = 0; i < res.length; i++) {
            // @ts-ignore
            if (res[i].start === this.year + '-' + currentMonth + '-' + currentDay && res[i].type === 'PERS') {
              // @ts-ignore
              if (res[i].type === 'PERS') {
                // @ts-ignore
                res[i].workAnywhere = 'PERS'; } else if (res[i].type === 'SICK') {
                // @ts-ignore
                res[i].workAnywhere = 'SICK'; } else if (res[i].type === 'VACA') {
                // @ts-ignore
                res[i].workAnywhere = 'VACA'; }
              this.dataSource.push(res[i]);
            }
          }
          this.spinner.hide();
        }
      });
    } else if (this.formGroupEmp.get('workAnyWhere').value === '2') {
    } else if (this.formGroupEmp.get('workAnyWhere').value === '3') {
      this.dataSource = [];
      this.calendarService.storeLeaveEmployee.subscribe((res) => {
        const currentMonth = ('0' + this.month).slice(-2) ;
        const currentDay = ('0' + this.day).slice(-2) ;
        if (res.length != 0) {
          for (let i = 0; i < res.length; i++) {
            // @ts-ignore
            if (res[i].start === this.year + '-' + currentMonth + '-' + currentDay && res[i].type !== 'SICK' && res[i].type !== 'VACA' && res[i].type !== 'PERS') {
              // @ts-ignore
              if (res[i].type === 'PERS') {
                // @ts-ignore
                res[i].workAnywhere = 'PERS'; } else if (res[i].type === 'SICK') {
                // @ts-ignore
                res[i].workAnywhere = 'SICK'; } else if (res[i].type === 'VACA') {
                // @ts-ignore
                res[i].workAnywhere = 'VACA'; }
              this.dataSource.push(res[i]);
            }
          }
          this.spinner.hide();
        }
      });
    } else {
      this.dataSource = [];
      this.calendarService.storeLeaveEmployee.subscribe((res) => {
        const currentMonth = ('0' + this.month).slice(-2) ;
        const currentDay = ('0' + this.day).slice(-2) ;
        if (res.length != 0) {
          for (let i = 0; i < res.length; i++) {
            // @ts-ignore
            if (res[i].start === this.year + '-' + currentMonth + '-' + currentDay) {
              // @ts-ignore
              if (res[i].type === 'PERS') {
                // @ts-ignore
                res[i].workAnywhere = 'PERS'; } else if (res[i].type === 'SICK') {
                // @ts-ignore
                res[i].workAnywhere = 'SICK'; } else if (res[i].type === 'VACA') {
                // @ts-ignore
                res[i].workAnywhere = 'VACA'; }
              this.dataSource.push(res[i]);
            }
          }
          this.spinner.hide();
        }
      });
    }

  }

}
