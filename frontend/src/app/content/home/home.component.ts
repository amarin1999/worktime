import { ComponentType } from "@angular/cdk/portal";
import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { first } from "rxjs/operators";
import { LayoutConstants } from "src/app/shared/constants/LayoutConstants";
//interface
import { Menu } from "src/app/shared/interfaces/menu";
//component
import { SideWorkComponent } from "../sidework/sidework.component";
import { OvertimeWorkComponent } from "../overtime-work/overtime-work.component";
//animate
import { trigger, transition, useAnimation } from "@angular/animations";
import { flipInY } from "ng-animate";
import { SideworkCalendarComponent } from '../sidework-calendar/sidework-calendar.component';


@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  providers: [],
  animations: [
    trigger("flipInY", [transition("* => *", useAnimation(flipInY))]),
  ],
})
export class HomeComponent implements OnInit {
  cdgImagePath: string = LayoutConstants.cdgImagePath;

  menu: Menu[] = [
    {
      title: "ทำงานนอกสถานที่",
      img: LayoutConstants.sideWorkImagePath,
      link: "main/sidework-calendar",
      type: "add",
    },
    {
      title: "ทำงานล่วงเวลา",
      img: LayoutConstants.overtimeImagePath,
      link: OvertimeWorkComponent,
      type: "add",
    },
    {
      title: "ประวัติการลงเวลา",
      img: LayoutConstants.historyImagePath,
      link: "main/history",
    },
  ];
  constructor(
    private dialog: MatDialog,
    private messageService: MessageService,
    private route: Router
  ) {}

  ngOnInit(): void {}

  onClickItem(item: Menu): void {
    if (typeof item.link === "string") {
      this.route.navigate([item.link]);
    } else {
      this.openDialog(item.type, item.link);
    }
  }

  openDialog(type: string, overlay: ComponentType<any>): void {
    const configDialog: MatDialogConfig<any> = {
      disableClose: true,
      autoFocus: false,
      data: { type },
    };
    const dialogRef = this.dialog.open(overlay, configDialog);
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
