import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { SideWork } from "src/app/shared/interfaces/sidework";
import { first } from "rxjs/operators";
import { EditWorkComponent } from "../../edit-work/edit-work.component";

@Component({
  selector: "app-history-side-work",
  templateUrl: "./history-side-work.component.html",
  styleUrls: ["./history-side-work.component.scss"]
})
export class HistorySideWorkComponent implements OnInit, OnChanges {
  @Input("sideWorkHistory") dataSideWork: SideWork[];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  // column
  displayedColumns: string[] = [
    "day",
    "startTime",
    "endTime",
    "workAnywhere",
    "remark"
  ];

  // source
  dataSource = new MatTableDataSource<SideWork>(this.dataSideWork);
  constructor(private dialog: MatDialog) {}

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
    const configDialog: MatDialogConfig<any> = {
      disableClose: true,
      autoFocus: false,
      data: { ...itemSideWork, type: "sideWork" }
    };

    const dialogRef = this.dialog.open(EditWorkComponent, configDialog);
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(
        (result: Response) => {},
        error => {}
      );
  }
}
