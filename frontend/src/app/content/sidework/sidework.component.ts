import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, first } from 'rxjs/operators';
import { LayoutConstants } from 'src/app/shared/constants/LayoutConstants';
import { Response } from 'src/app/shared/interfaces/response';
import { SideWork } from 'src/app/shared/interfaces/sidework';
import { SideWorkService } from 'src/app/shared/service/sidework.service';

@Component({
  selector: 'app-sidework',
  templateUrl: './sidework.component.html',
  styleUrls: ['./sidework.component.scss'],
})
export class SideWorkComponent implements OnInit {
  // constants
  img = {
    imgInsert: LayoutConstants.sideWorkImagePath,
    imgEdit: LayoutConstants.editWorkImagePath,
  };

  // datevalid
  isDateValid = { status: false };

  constructor(
    private dialogRef: MatDialogRef<SideWorkComponent>,
    private sideWorkService: SideWorkService,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public dataForm: SideWork
  ) {}

  ngOnInit(): void {
    this.sideWorkService.loadEventCalendar();
  }

  // เช็ควันว่าลงเวลาแล้วหรือยัง
  checkDay(date: Date): void {
    this.spinner.show();
    this.sideWorkService
      .getSideWorkOnDay(localStorage.getItem('employeeNo'), date)
      .pipe(
        first(),
        finalize(() => this.spinner.hide())
      )
      .subscribe(
        (res: Response) => {
          switch (res.code) {
            case 200: {
              this.isDateValid = { status: true };
              break;
            }
            case 404: {
              this.isDateValid = { status: false };
              break;
            }
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  // check type จัดการข้อมูล
  emitSideWork(formItem: SideWork): void {
    this.spinner.show();
    switch (this.dataForm.type) {
      case 'edit': {
        // set วันที่ format
        const dateFormat = moment(formItem.date, 'DD/MM/YYYY').format(
          'YYYY-MM-DD'
        );
        delete formItem.date;
        const requestData = {
          date: dateFormat,
          ...formItem,
          employeeNo: localStorage.getItem('employeeNo'),
        };
        this.editSideWork(requestData);
        break;
      }
      case 'add': {
        const requestData = {
          ...formItem,
          employeeNo: localStorage.getItem('employeeNo'),
        };
        this.insertSideWork(requestData);
        break;
      }
    }
  }

  // เพิ่มข้อมูล
  insertSideWork(requestData: SideWork): void {
    this.sideWorkService
      .addSidework(requestData)
      .pipe(
        first(),
        finalize(() => {
          this.spinner.hide();
          // reload calendar
          this.sideWorkService.loadEventCalendar();
          this.sideWorkService.loadSideworkCalendar();
        })
      )
      .subscribe(
        (response: Response) => {
          this.dialogRef.close(response);
        },
        (error) => {
          this.dialogRef.close(error);
        }
      );
  }

  // แก้ไขข้อมูล
  editSideWork(sideWorkItem: SideWork): void {
    this.spinner.show();
    const requestData = {
      id: this.dataForm.id,
      ...sideWorkItem,
    };
    this.sideWorkService
      .editSideWork(requestData)
      .pipe(
        first(),
        finalize(() => {
          this.spinner.hide();
          // reload calendar
          this.sideWorkService.loadEventCalendar();
          this.sideWorkService.loadSideworkCalendar();
        })
      )
      .subscribe(
        (response: Response) => {
          // patch subject sideWork
          this.sideWorkService
            .setSideWork(localStorage.getItem('employeeNo'))
            .pipe(first())
            .subscribe();
          this.dialogRef.close(response);
        },
        (error) => {
          this.dialogRef.close(error);
        }
      );
  }

  // ลบข้อมูล
  deleteSideWork(sideworkId: number): void {
    this.spinner.show();
    this.sideWorkService
      .deleteSideWork(sideworkId)
      .pipe(
        first(),
        finalize(() => {
          this.spinner.hide();
          // reload calendar
          this.sideWorkService.loadEventCalendar();
          this.sideWorkService.loadSideworkCalendar();
        })
      )
      .subscribe((error) => {
        this.dialogRef.close(error);
      });
  }

}
