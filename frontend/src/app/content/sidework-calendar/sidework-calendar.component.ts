import { NgxSpinnerService } from 'ngx-spinner';
import { Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { EmployeeService } from './../../shared/service/employee.service';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import thLocale from '@fullcalendar/core/locales/th';
import { SideWorkComponent } from '../sidework/sidework.component';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MessageService, SelectItem } from 'primeng/api';
import { first, debounceTime } from 'rxjs/operators';
import { Calendar } from 'src/app/shared/interfaces/calendar';
import { SideWork } from 'src/app/shared/interfaces/sidework';
import { SideWorkService } from 'src/app/shared/service/sidework.service';
import { Subject, Subscription } from 'rxjs';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ExcelService } from 'src/app/shared/service/excel.service';
import { CalendarService } from 'src/app/shared/service/calendar.service';

@Component({
  selector: 'app-sidework-calendar',
  templateUrl: './sidework-calendar.component.html',
  styleUrls: ['./sidework-calendar.component.scss'],
})
export class SideworkCalendarComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('op') op: OverlayPanel;
  sideWorkHistory: Subject<SideWork[]> = this.getHistorySideWork();
  events: any;
  holidayEvents: any = [];
  leaveEmployee: any; // เพ้ิ่มเติม  วันลาพนักงาน
  leaveEvents: any = [];
  sideworkEvents: any = [];
  calendarEvents: Calendar[];
  options: any;
  searchId: number;
  data: SideWork[];
  item: SideWork;
  dateCilckValue: Date;
  subscription = new Subscription();
  message: string;
  idSideWork: string;
  titleMessage: string;
  togglePanel$ = new Subject<any>();
  showExcelExport = false;
  accessDialog = false;
  regisDialog = false;
  EmpAccReportDialog: any;
  empDate: Date;
  eventDateClick: Date;
  calendarDate: Date;
  showAccess: string;
  selectedEmployee: SelectItem[];
  regisFormAccess: FormGroup;
  edtFormAccess: FormGroup;
  searchAccessForm: FormGroup;
  empAccessReportList: any;

  constructor(
    private dialog: MatDialog,
    private messageService: MessageService,
    private excelService: ExcelService,
    private sideworkService: SideWorkService,
    private spinner: NgxSpinnerService,
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder,
    private calendarService: CalendarService
  ) {}

  ngOnInit(): void {
    this.checkEmployee();
    this.calendarLoad();
    this.sideworkEvents = {
      [Symbol.iterator]() {
        return [][Symbol.iterator]();
      },
    };

    this.holidayEvents = {
      [Symbol.iterator]() {
        return [][Symbol.iterator]();
      },
    };

    this.initFormAccess();
    this.initRegisForm();
    this.initSearchAccessReportForm();
    this.selectQuery();
  }

  calendarChangeDate(date: Date) {
    this.calendarDate = date;

    const holidayMonth = this.calendarDate.getMonth() + 1;
    const holidayYear = this.calendarDate.getUTCFullYear();
    const leaveYear = this.calendarDate.getFullYear();
    const currentYear = localStorage.getItem('year');

    localStorage.setItem('month', holidayMonth.toString());
    localStorage.setItem('year', holidayYear.toString());
    localStorage.setItem('year', leaveYear.toString());

    if (currentYear != null) {
      if (currentYear != leaveYear.toString()) {
        this.spinner.show();
        this.calendarService.requestLeavEmpYear = null;
        this.LoadAllEventsOnCalendar();
        this.LoadLeaveYearEmployee();
      }
    }
    // this.holidaysEventService();
    // this.leaveEmployeeEventService();
  }

  ngAfterViewInit() {
    this.LoadAllEventsOnCalendar();
    this.LoadLeaveYearEmployee();

    // debounceTime ของ layoutPanel
    //จะทำกรณีเอาเมาส์ไปชี้ที่ event บนปฏิทิน
    this.subscription.add(
      this.togglePanel$.pipe(debounceTime(300)).subscribe((result) => {
        // console.log(result)
        if (result.display) {
          this.idSideWork = result.event.event.id;
          this.message = result.event.event.extendedProps.remark;
          this.titleMessage = result.event.event.title;
          this.op.toggle(result.event.jsEvent);
        } else {
          this.op.hide();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  calendarLoad() {
    this.options = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      locales: [thLocale],
      locale: 'th',
      firstDay: 0, // sunday
      // height: 'parent',
      showNonCurrentDates: false,
      aspectRatio: 2.3,
      defaultView: 'dayGridMonth',
      displayEventTime: false,
      header: {
        left: 'today',
        center: 'title',
        right: 'prev,next',
      },

      //dayGridMonth,timeGridWeek,timeGridDay
      editable: true,
      selectable: false,
      dateClick: (el) => {
        const requestData = {
          ...Subject,
          employeeNo: localStorage.getItem('employeeNo'),
        };

        this.dateCilckValue = el.date;
        let weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
          new Date(this.dateCilckValue).getDay()
        ];

        // เช็ครหัสพนักงาน
        this.employeeService
          .getEmployee(requestData.employeeNo)
          .subscribe((res) => {
            // if ((requestData.employeeNo == '004061' || requestData.employeeNo == '001153' || requestData.employeeNo == '000242'
            // || requestData.employeeNo == '000168' || requestData.employeeNo == '000225' || requestData.employeeNo == '004912')
            // && (weekday != 'Sun' && weekday != 'Sat')) {
            if (
              (this.showAccess === 'Y' ||
                this.showAccess === 'A' ||
                this.showAccess === 'M') &&
              weekday != 'Sun' &&
              weekday != 'Sat'
            ) {
              this.empDate = el.date;
              this.opendialogShowEmp('form');
            } else {
              // วันเสาร์-อาทิตย์กดลงเวลาไม่ได้
              if (weekday != 'Sun' && weekday != 'Sat') {
                this.openDialogInsert('add');
              }
            }
          });
      },
      eventClick: (el) => {
        this.searchId = parseInt(el.event.id, 0);
        this.eventDateClick = el.event.start;
        this.item = this.data.find((i) => i.id === this.searchId);
        this.togglePanel$.next({
          event: el,
          display: false,
        });
        if (this.item != null || this.item != undefined) {
          this.openDialogEdit('edit', this.item);
        }
      },

      eventMouseEnter: (el) => {
        this.togglePanel$.next({
          event: el,
          display: true, // เปิด layoutPane0l
        });
      },

      eventMouseLeave: (el) => {
        this.togglePanel$.next({
          event: el,
          display: false, // ปิด layoutPanel
        });
      },
    };
  }

  SetEventColor() {
    //console.log(this.events)
    //console.log(this.events)
    this.events = this.events.map((event) => {
      return {
        ...event,

        color:
          event.workAnyWhere === 1
            ? 'SteelBlue'
            : event.workAnyWhere === 2
            ? 'SeaGreen'
            : event.workAnyWhere === 3
            ? 'RebeccaPurple'
            : event.workAnyWhere === 0
            ? 'Maroon'
            : event.title.includes('ลา')
            ? 'Orange'
            : ' rgb(243, 127, 127)',
        textColor:
          event.workAnyWhere === 1
            ? 'Azure'
            : event.workAnyWhere === 2
            ? 'Azure'
            : event.workAnyWhere === 3
            ? 'Azure'
            : event.workAnyWhere === 0
            ? 'Azure'
            : event.title.includes('ลา')
            ? 'Black'
            : 'Black',
      };
    });
  }

  LoadLeaveYearEmployee() {
    this.subscription.add(
      this.calendarService.onLoadYearLeaves$.subscribe((leaveYearEvent) => {
        this.calendarService.changeSourceLeaveEmployee(leaveYearEvent);
      })
    );
    this.calendarService.loadYearLeaves();
  }

  LoadAllEventsOnCalendar() {
    // โหลด sidework event ขึ้นบน calendar

    this.subscription.add(
      this.sideworkService.onLoadEventCalendar$.subscribe((sideworkEvent) => {
        this.sideworkEvents = sideworkEvent;
        //console.log('sideworkEvent')
        //console.log(this.sideworkEvents)
        //this.events ใช้สำหรับนำ events ทั้งหมดที่มีขึ้นบนปฏิทิน
        //console.log(this.events)

        if (!this.events) {
          this.events = [...this.sideworkEvents];
        } else {
          this.events = [
            ...this.sideworkEvents,
            ...this.holidayEvents,
            ...this.leaveEvents,
          ];
        }

        //console.log(this.events)
        // ตั้งค่าสีให้กับ events
        this.SetEventColor();
      })
    );
    this.sideworkService.loadEventCalendar();

    //โหลด data sidework มาดึงขึ้น editdialog form
    this.subscription.add(
      this.sideworkService.onLoadSideworkCalendar$.subscribe((data) => {
        this.data = data;
        // console.log('data')
        // console.log(this.data)
      })
    );
    this.sideworkService.loadSideworkCalendar();

    // โหลด holiday event
    this.subscription.add(
      this.calendarService.onLoadHolidays$.subscribe((holidayEvent) => {
        this.holidayEvents = holidayEvent;
        // console.log('holidayEvent')
        // console.log(this.events)
        //console.log(this.holidayEvents)
        //this.events ใช้สำหรับนำ events ทั้งหมดที่มีขึ้นบนปฏิทิน
      })
    );
    this.calendarService.loadHolidays();

    // โหลด leave event
    this.subscription.add(
      this.calendarService.onLoadLeaves$.subscribe((leaveEvent) => {
        // console.log(leaveEvent)
        this.leaveEvents = leaveEvent;

        // console.log('leaveEvents')
        //console.log(this.leaveEvents)
        //this.events ใช้สำหรับนำ events ทั้งหมดที่มีขึ้นบนปฏิทิน
        if (this.holidayEvents) {
          this.events = [
            ...this.sideworkEvents,
            ...this.holidayEvents,
            ...this.leaveEvents,
          ];
        } else {
          this.events = [...this.sideworkEvents, ...this.leaveEvents];
        }
        // ตั้งค่าสีให้กับ events
        //console.log(this.events)

        this.SetEventColor();
      })
    );
    this.calendarService.loadLeaves();
    this.spinner.hide();
  }

  getHistorySideWork(): Subject<SideWork[]> {
    return this.sideworkService.getSideWork();
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
          //console.log(result.status)
          if (result.status === 'Success') {
            //console.log(result.status)
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

  opendialogShowEmp(type: string) {
    const configDialog: MatDialogConfig<object> = {
      disableClose: false,
      autoFocus: false,
      data: { type, date: this.empDate, workAnyWhere: 1, empListClickCheck: 1 },
    };
    const dialogRef = this.dialog.open(SideWorkComponent, configDialog);
    dialogRef.afterClosed().subscribe();
  }

  openDialogEdit(type: string, itemSideWork: SideWork) {
    const configDialog: MatDialogConfig<object> = {
      disableClose: false,
      autoFocus: false,
      data: {
        ...itemSideWork,
        type,
        sideworkId: this.searchId,
        Date: this.eventDateClick,
      },
    };

    const dialogRef = this.dialog.open(SideWorkComponent, configDialog);
    dialogRef.afterClosed().subscribe((result) => {
      if (
        result.status === 'Success' &&
        this.sideworkService.deleteStatus === false
      ) {
        this.messageService.clear();
        this.messageService.add({
          key: 'SuccessMessage',
          severity: 'success',
          summary: 'ข้อความ',
          detail: 'แก้ไขการลงเวลาเรียบร้อยแล้ว',
        });
      } else if (
        result.status === 'Success' &&
        this.sideworkService.deleteStatus === true
      ) {
        this.messageService.clear();
        this.messageService.add({
          key: 'SuccessMessage',
          severity: 'success',
          summary: 'ข้อความ',
          detail: 'ลบรายการลงเวลาเรียบร้อยแล้ว',
        });
      } else if (result.error) {
        this.messageService.add({
          key: 'errorMessage',
          severity: 'error',
          summary: 'ข้อความ',
          detail: result.error.errorMessage,
        });
      }
    });
  }
  // get holiday จาก web Service
  holidaysEventService() {
    const requestData = {
      ...Subject,
      employeeNo: localStorage.getItem('employeeNo'),
      holidayYear: localStorage.getItem('year'),
      display: 'background',
    };
    // console.log(requestData)
    // console.log(Subject)
  }

  // Get leaveEmployee จ่าก webService
  leaveEmployeeEventService() {
    const requestData = {
      ...Subject,
      employeeNo: localStorage.getItem('employeeNo'),
      leaveYear: localStorage.getItem('year'),
    };

    // console.log(requestData)
  }

  exportText() {
    const month = this.calendarDate.getMonth() + 1;
    const year = this.calendarDate.getFullYear();
    this.excelService.getText(month, year).subscribe(
      (blob) =>
        this.excelService.download(
          blob,
          'WorkTime ' + year + '-' + String('0' + month).slice(-2) + '.dat'
        ),
      (err) => console.error(err)
    );
  }

  exportExcelClickWFH() {
    const year = this.calendarDate.getFullYear();
    const month = this.calendarDate.getMonth() + 1;
    this.excelService.getExcelWFH(month).subscribe(
      (blob) =>
        this.excelService.download(
          blob,
          'WorkTime ' + year + '-' + String('0' + month).slice(-2) + '.xlsx'
        ),
      (err) => console.error(err)
    );
  }
  exportExcelClickLeave() {
    const year = this.calendarDate.getFullYear();
    const month = this.calendarDate.getMonth() + 1;
    this.excelService.getExcelLeave(month, year).subscribe(
      (blob) =>
        this.excelService.download(
          blob,
          'LeaveEmployee' + year + '-' + String('0' + month).slice(-2) + '.xlsx'
        ),
      (err) => console.error(err)
    );
  }
  // ตรวจสอบ employee ที่ล็อกอินเข้ามา
  checkEmployee(): any {
    const requestData = {
      ...Subject,
      employeeNo: localStorage.getItem('employeeNo'),
    };
    this.employeeService
      .getEmployee(requestData.employeeNo)
      .subscribe((res) => {
        this.showAccess = res.data.accessReport;
        if (
          this.showAccess === 'Y' ||
          this.showAccess === 'A' ||
          this.showAccess === 'M'
        ) {
          this.showExcelExport = true;
        }
      });
    // if (requestData.employeeNo == '004061' || requestData.employeeNo == '001153' || requestData.employeeNo == '000242'
    //   || requestData.employeeNo == '000168' || requestData.employeeNo == '000225' || requestData.employeeNo == '004912') {
    //   this.showExcelExport = true;
    // }
  }

  //Dialog สำหรับหน้าต่าง Access
  showDialogAccess() {
    this.accessDialog = true;
    this.edtFormAccess.reset();
  }

  initFormAccess() {
    this.edtFormAccess = this.formBuilder.group({
      id: null,
      no: null,
      accessReport: null,
    });
  }

  closeDialogAccess() {
    this.accessDialog = false;
  }

  selectQuery() {
    this.employeeService.getAllEmployee().subscribe((res) => {
      this.selectedEmployee = [];
      this.selectedEmployee.push({
        label: 'กรุณาเลือกพนักงาน',
        value: null,
      });
      for (let i = 0; i < res.data.length; i++) {
        this.selectedEmployee.push({
          label:
            res.data[i].no +
            ' - ' +
            res.data[i].firstname +
            ' ' +
            res.data[i].lastname,
          value: res.data[i].no,
        });
      }
    });
  }

  onChangeAccess(event: any) {
    if (event.value === null) {
      this.edtFormAccess.patchValue({ access: null });
    } else {
      this.employeeService.getEmployeeByID(event.value).subscribe((res) => {
        this.edtFormAccess.patchValue(res.data[0]);
      });
    }
  }

  updateAccess(value: any) {
    if (this.edtFormAccess.value.no == null) {
      this.messageService.add({
        key: 'SuccessMessage',
        severity: 'error',
        summary: 'แจ้งเตือน',
        detail: 'กรุณาเลือกพนักงาน',
      });
    }
    this.employeeService.editAccess(value.value).subscribe((res) => {
      this.accessDialog = false;
      this.messageService.add({
        key: 'SuccessMessage',
        severity: 'success',
        summary: 'แจ้งเตือน',
        detail: 'แก้ไขสิทธิ์การเข้าถึงเรียบร้อยแล้ว',
      });
    });
  }

  //Dialog Employee Access
  showEmployeeAccessReport() {
    this.employeeService.getEmployeeByAccessReport('N').subscribe((res) => {
      this.empAccessReportList = res.data;
      if (this.empAccessReportList != null) {
        this.EmpAccReportDialog = true;
        this.accessDialog = false;
      } else {
      }
    });
  }

  initSearchAccessReportForm() {
    this.searchAccessForm = this.formBuilder.group({
      value: 'N',
    });
  }

  clickWhereEmployeAccessReport() {
    this.employeeService
      .getEmployeeByAccessReport(this.searchAccessForm.get('value').value)
      .subscribe((res) => {
        this.empAccessReportList = res.data;
      });
  }

  closeEmployeeAccessReport() {
    this.EmpAccReportDialog = false;
  }

  showDialogRegis() {
    this.regisDialog = true;
    this.regisFormAccess.reset();
    this.regisFormAccess.patchValue({ accessReport: 'N' });
  }

  initRegisForm() {
    this.regisFormAccess = this.formBuilder.group({
      employeeno: ['',[Validators.required]],
      firstname: ['',[Validators.required]],
      lastname: ['',[Validators.required]],
      active: 'Y',
      accessReport: ['N',[Validators.required]],
    });
  }

  regisEmployee(value) {
    this.regisFormAccess.patchValue({ active: 'Y' });
    if (this.regisFormAccess.invalid) {
      this.regisFormAccess.markAllAsTouched();
      this.messageService.add({
        key: 'SuccessMessage',
        severity: 'error',
        summary: 'แจ้งเตือน',
        detail: 'กรุณากรอกข้อมูลให้ครบถ้วน',
      });
      return
    }
    if (this.regisFormAccess.valid) {
      this.employeeService.regisEmptloyee(value.value).subscribe(
        (res) => {
          if (res.code == 200) {
            this.regisDialog = false;
            this.messageService.clear();
            this.messageService.add({
              key: 'SuccessMessage',
              severity: 'success',
              summary: 'แจ้งเตือน',
              detail: 'เพิ่มสมาชิกเรียบร้อยแล้ว',
            });
          }
        },
        (error) => {
          this.regisDialog = false;
          this.messageService.clear();
          this.messageService.add({
            key: 'errorMessage',
            severity: 'error',
            summary: 'ผิดพลาด',
            detail: error.error.errorMessage,
          });
        }
      );
    }
  }

  closeDialogRegis() {
    this.regisDialog = false;
  }
}
