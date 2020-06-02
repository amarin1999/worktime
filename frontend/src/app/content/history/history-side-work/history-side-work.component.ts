import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MessageService } from "primeng/api";
import { SideWork } from "src/app/shared/interfaces/sidework";
import { SideWorkComponent } from "../../sidework/sidework.component";
@Component({
  selector: "app-history-side-work",
  templateUrl: "./history-side-work.component.html",
  styleUrls: ["./history-side-work.component.scss"]
})
export class HistorySideWorkComponent implements OnInit {
  @Input("sideWorkHistory") dataSideWork: SideWork[];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  // column
  displayedColumns: string[] = [
    "date",
    "startTime",
    "endTime",
    "workAnywhere",
    "remark"
  ];

  // source
  dataSource = new MatTableDataSource<SideWork>(this.dataSideWork);
  constructor(
    private dialog: MatDialog,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.dataSource = new MatTableDataSource<SideWork>(this.dataSideWork);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialogEdit(itemSideWork: SideWork): void {
    const configDialog: MatDialogConfig<Object> = {
      disableClose: true,
      autoFocus: false,
      data: { ...itemSideWork, type: "edit" }
    };

    let dialogRef = this.dialog.open(SideWorkComponent, configDialog);

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
