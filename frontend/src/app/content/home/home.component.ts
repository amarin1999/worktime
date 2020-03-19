import { ComponentType } from "@angular/cdk/portal";
import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MessageService } from "primeng/api";
import { take } from "rxjs/operators";
import { LayoutConstants } from "src/app/shared/constants/LayoutConstants";
//component
import { OvertimeworkformComponent } from "../overtimeworkform/overtimeworkform.component";
import { SideworkComponent } from "../sidework/sidework.component";
import { Response } from "src/app/shared/interfaces/response";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  providers: []
})
export class HomeComponent implements OnInit {
  cdgImagePath: string = LayoutConstants.cdgImagePath;

  menu: {
    title: string;
    img: string;
    link: ComponentType<any> | string;
  }[] = [
    {
      title: "ทำงานนอกสถานที่",
      img: LayoutConstants.sideWorkImagePath,
      link: SideworkComponent
    },
    {
      title: "ทำงานล่วงเวลา",
      img: LayoutConstants.overtimeImagePath,
      link: OvertimeworkformComponent
    },
    {
      title: "ประวัติการลงเวลา",
      img: LayoutConstants.historyImagePath,
      link: "main/history"
    }
  ];
  constructor(
    private dialog: MatDialog,
    private messageService: MessageService,
    private route: Router
  ) {}

  ngOnInit(): void {}

  onClickItem(item: {
    title: string;
    img: string;
    link: ComponentType<any> | string;
  }): void {
    if (typeof item.link === "string") {
      this.route.navigate([item.link]);
    } else {
      const configDialog: MatDialogConfig<any> = {
        disableClose: true,
        autoFocus: false
      };
      const dialogRef = this.dialog.open(item.link, configDialog);
      dialogRef
        .afterClosed()
        .pipe(take(1))
        .subscribe(
          (result: Response) => {
            if (result.status === "Success") {
              this.messageService.clear();
              this.messageService.add({
                key: "SuccessMessage",
                severity: "success",
                summary: "แจ้งเตือน",
                detail: "ลงเวลาเรียบร้อยแล้ว"
              });
            }
          },
          error => {
            this.messageService.add({
              key: "errorMessage",
              severity: "error",
              summary: "ผิดพลาด",
              detail: "เกิดข้อผิดพลาดระหว่างเพิ่มข้อมูล"
            });
          }
        );
    }
  }
}
