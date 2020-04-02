import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MessageService } from "primeng/api";
import { OvertimeWork } from "src/app/shared/interfaces/overtime";
import { OvertimeWorkComponent } from "../../overtime-work/overtime-work.component";

@Component({
  selector: "app-history-overtime-work",
  templateUrl: "./history-overtime-work.component.html",
  styleUrls: ["./history-overtime-work.component.scss"]
})
export class HistoryOvertimeWorkComponent implements OnInit, OnChanges {
  @Input("overtimeWorkHistory") dataOvertimeWork: OvertimeWork[];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  displayedColumns: string[] = ["idProject", "startTime", "endTime", "remark"];

  // source
  dataSource = new MatTableDataSource<OvertimeWork>(this.dataOvertimeWork);

  constructor(
    private dialog: MatDialog,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.dataSource = new MatTableDataSource<OvertimeWork>(
        this.dataOvertimeWork
      );
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialogEdit(itemOvertimeWork: OvertimeWork): void {
    const configDialog: MatDialogConfig<Object> = {
      disableClose: true,
      autoFocus: false,
      data: { ...itemOvertimeWork, type: "edit" }
    };

    let dialogRef = this.dialog.open(OvertimeWorkComponent, configDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === "Success") {
        this.messageService.clear();
        this.messageService.add({
          key: "SuccessMessage",
          severity: "success",
          summary: "แจ้งเตือน",
          detail: "แก้ไขการลงเวลาเรียบร้อยแล้ว"
        });
      } else if (result.error) {
        this.messageService.add({
          key: "errorMessage",
          severity: "error",
          summary: "ผิดพลาด",
          detail: result.error.errorMessage
        });
      }
    });
  }
}
