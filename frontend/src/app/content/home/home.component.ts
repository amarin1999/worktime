import { ComponentType } from "@angular/cdk/portal";
import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { NgxSpinnerService } from "ngx-spinner";
import { LayoutConstants } from "src/app/shared/constants/LayoutConstants";
//component
import { OvertimeworkformComponent } from "../overtimeworkform/overtimeworkform.component";
import { SideworkformComponent } from "../sideworkform/sideworkform.component";
import { SideWork } from "src/app/shared/interfaces/sidework";
import { SideworkService } from "src/app/shared/service/sidework.service";
import { finalize } from "rxjs/operators";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  providers: []
})
export class HomeComponent implements OnInit {
  cdgImagePath: string = LayoutConstants.cdgImagePath;

  menu: { title: string; img: string; overlay: ComponentType<any> }[] = [
    {
      title: "ทำงานนอกสถานที่",
      img: LayoutConstants.sideWorkImagePath,
      overlay: SideworkformComponent
    },
    {
      title: "ทำงานล่วงเวลา",
      img: LayoutConstants.overtimeImagePath,
      overlay: OvertimeworkformComponent
    },
    {
      title: "ประวัติการลงเวลา",
      img: LayoutConstants.historyImagePath,
      overlay: OvertimeworkformComponent
    }
  ];
  constructor(
    public dialog: MatDialog,
    public messageService: MessageService
  ) {}

  ngOnInit(): void {}

  openDialog(overlay: ComponentType<unknown>): void {
    const configDialog: MatDialogConfig<any> = {
      disableClose: true,
      autoFocus: false
    };
    const dialogRef = this.dialog.open(overlay, configDialog);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result.status === "Success") {
          this.messageService.clear();
          this.messageService.add({
            key: "SuccessMessage",
            severity: "success",
            summary: "",
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
