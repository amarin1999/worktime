import { Component, OnInit } from '@angular/core';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarService } from 'src/app/shared/service/calendar.service';
import thLocale from "@fullcalendar/core/locales/th";
import { SideWorkComponent } from '../sidework/sidework.component';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { first, finalize } from 'rxjs/operators';
import { Calendar } from 'src/app/shared/interfaces/calendar';

@Component({
  selector: "app-sidework-calendar",
  templateUrl: "./sidework-calendar.component.html",
  styleUrls: ["./sidework-calendar.component.scss"],
})
export class SideworkCalendarComponent implements OnInit {
  events: Calendar[];
  events1: Calendar[];
  options: any;

  constructor(
    private dialog: MatDialog,
    private messageService: MessageService,
    private calendarService: CalendarService
  ) {}

  ngOnInit(): void {
    // get sidework events show on calendar
    this.calendarService.getSideWorkEventForCalendar
    (localStorage.getItem("employeeNo"))
      .then(events => { this.events = events; });
    // get ot events show on calendar
    // this.calendarService.getOtEventForCalendar
    //   (localStorage.getItem("employeeNo"))
    //   .then(events => { this.events = events; });

    this.options = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      locales: [thLocale],
      height: "parent",
      defaultView: "dayGridMonth",
      locale: "th",
      displayEventTime: false,
      themeSystem: 'standard',
      header: {
        left: 'dayGridMonth,timeGridWeek,timeGridDay ',
        center: 'title',
        right: 'today prev,next '
      },
      editable: true,
      selectable: true,
      eventColor: '',
      dateClick: (e) => {
        this.openDialog("add");  // click on date to open dialog
      },
      // eventSources: [
      //   this.events,
      //   this.events1
      // ]
    };
  }

  openDialog(type: string): void {
    const configDialog: MatDialogConfig<any> = {
      disableClose: true,
      autoFocus: false,
      data: { type },
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
}
