import { Component, ViewChild, AfterViewInit, } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EmployeeByDay } from 'src/app/shared/interfaces/employee-by-day';
import { EmployeeByDayService } from 'src/app/shared/service/employee-by-day.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SideWorkComponent } from '../sidework.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-show-emp-by-day',
  templateUrl: './show-emp-by-day.component.html',
  styleUrls: ['./show-emp-by-day.component.scss']
})
export class ShowEmpByDayComponent implements AfterViewInit {


  constructor(
    private empService: EmployeeByDayService,
    private dialogRef: MatDialogRef<SideWorkComponent>,
  ) { }

  ngAfterViewInit(): void {
    this.qureyEmployeeByDay();
  }
  // ngOnDestroy(): void {
  //   this.subs.unsubscribe();
  // }

  // subs: Subscription;
  displayedColumns: string[] = ['employeeNo', 'firstname', 'lastname', 'workAnywhere'];
  employeeList: EmployeeByDay[];
  dataSource = new MatTableDataSource<EmployeeByDay>(this.employeeList);

  // @ViewChild(MatPaginator) paginator: MatPaginator;

  // @Input() count = 0;
  // @Output() countChange = new EventEmitter<number>();
  // increment() {
  //   this.countChange.emit(this.count);
  // }

  selectWork: string = '1';
  works: string[] = ['1', '2', '4', '3'];

  // ngAfterViewInit(): void {
  //   this.qureyEmployeeByDay();
  // }

  qureyEmployeeByDay() {
    const year = this.dialogRef.componentInstance.dataForm.date.getUTCFullYear();
    const month = this.dialogRef.componentInstance.dataForm.date.getUTCMonth() + 1;
    const day = this.dialogRef.componentInstance.dataForm.date.getUTCDate() + 1;

    const work = this.selectWork;

    this.empService.getEmployeeByDay(year, month, day, work).subscribe((list) => {
      this.employeeList = list;
      this.dataSource = new MatTableDataSource<EmployeeByDay>(this.employeeList);
      // this.dataSource.paginator = this.paginator;
    }), error => {

    }
  }

  // clickSelect() {
  //   const work = this.selectWork;
  //   this.qureyEmployeeByDay(work)
  // }

  // ngOnDestroy() {
  //   this.empService.unsubscribe()
  // }

}


