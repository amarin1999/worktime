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

@Component({
  selector: 'app-test2',
  templateUrl: './test2.component.html',
  styleUrls: ['./test2.component.scss']
})
export class Test2Component implements OnInit {

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

  }

}
