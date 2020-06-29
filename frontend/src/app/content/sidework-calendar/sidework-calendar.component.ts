import { Component, OnInit, Input } from '@angular/core';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarService } from 'src/app/shared/service/calendar.service';
import thLocale from "@fullcalendar/core/locales/th";
import { SideWorkComponent } from '../sidework/sidework.component';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { first, finalize, map } from 'rxjs/operators';
import { Calendar } from 'src/app/shared/interfaces/calendar';
import { SideWork } from 'src/app/shared/interfaces/sidework';
import { SideWorkService } from 'src/app/shared/service/sidework.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';

@Component({
  selector: "app-sidework-calendar",
  templateUrl: "./sidework-calendar.component.html",
  styleUrls: ["./sidework-calendar.component.scss"],
})
export class SideworkCalendarComponent implements OnInit {
  sideWorkHistory: Subject<SideWork[]> = this.getHistorySideWork();
  events: Calendar[];
  options: any;
  searchId: number;
  data: SideWork[];
  item: SideWork;
  dateCilckValue: Date;

  constructor(
    private dialog: MatDialog,
    private messageService: MessageService,
    private calendarService: CalendarService,
    private sideworkService: SideWorkService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.loadEvent();
    this.loadSideWork();

    this.options = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      locales: [thLocale],
      // height: "parent",
      aspectRatio: 2.2,
      defaultView: "dayGridMonth",
      locale: "th",
      displayEventTime: false,
      header: {
        left: "dayGridMonth,today",
        center: "title",
        right: "prev,next ",
      },
      editable: true,
      selectable: true,
      dateClick: (el) => {
        this.dateCilckValue = el.date;
        this.openDialogInsert("add");
      },
      eventClick: (el) => {
        this.searchId = parseInt(el.event.id);
        this.item = this.data.find((i) => i.id === this.searchId);
        this.openDialogEdit(this.item);
      },
    };
  }

  loadEvent() {
    // get sidework events show on calendar
    this.calendarService
      .getSideWorkEventForCalendar(localStorage.getItem("employeeNo"))
      .then((events) => {
        this.events = events;
      });
  }

  loadSideWork() {
    this.spinner.show();
    this.sideworkService
      .getHistorySideWork(localStorage.getItem("employeeNo"))
      .pipe(
        first(),
        finalize(() => this.spinner.hide())
      )
      .subscribe((res) => { this.data = res["data"] as SideWork[]; });
  }

  getHistorySideWork(): Subject<SideWork[]> {
    return this.sideworkService.getSideWork();
  }

  openDialogInsert(type: string): void {
    const configDialog: MatDialogConfig<any> = {
      disableClose: true,
      autoFocus: false,
      data: { type, dateClickValue: this.dateCilckValue },
    };
    const dialogRef = this.dialog.open(SideWorkComponent, configDialog);
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(
        (result) => {
          if (result.status === "Success") {
            this.messageService.clear();
            this.messageService.add({
              key: "SuccessMessage",
              severity: "success",
              summary: "แจ้งเตือน",
              detail: "ลงเวลาเรียบร้อยแล้ว",
            });
          } else if (result.error) {
            this.messageService.clear();
            this.messageService.add({
              key: "errorMessage",
              severity: "error",
              summary: "ผิดพลาด",
              detail: result.error.errorMessage,
            });
          }
        },
        (error) => {
          this.messageService.clear();
          this.messageService.add({
            key: "errorMessage",
            severity: "error",
            summary: "ผิดพลาด",
            detail: "เกิดข้อผิดพลาดระหว่างเพิ่มข้อมูล",
          });
        }
      );
  }

  openDialogEdit(itemSideWork: SideWork): void {
    const configDialog: MatDialogConfig<Object> = {
      disableClose: true,
      autoFocus: false,
      data: { ...itemSideWork, type: "edit" },
    };

    let dialogRef = this.dialog.open(SideWorkComponent, configDialog);
    dialogRef.afterClosed().subscribe((result) => {
      if (result.status === "Success") {
        this.messageService.clear();
        this.messageService.add({
          key: "SuccessMessage",
          severity: "success",
          summary: "แจ้งเตือน",
          detail: "แก้ไขการลงเวลาเรียบร้อยแล้ว",
        });
      } else if (result.error) {
        this.messageService.add({
          key: "errorMessage",
          severity: "error",
          summary: "ผิดพลาด",
          detail: result.error.errorMessage,
        });
      }
    });
  }
}
