import { ComponentType } from '@angular/cdk/portal';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

//component
import { OvertimeworkformComponent } from '../overtimeworkform/overtimeworkform.component';
import { SidworkformComponent } from '../sidworkform/sidworkform.component';
import { LayoutConstants } from 'src/app/shared/constants/LayoutConstants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: []
})
export class HomeComponent implements OnInit {
  cdgImagePath: string = LayoutConstants.cdgImagePath;
  menu: { title: string, img: string, overlay }[] = [
    {
      title: 'ทำงานนอกสถานที่',
      img: LayoutConstants.sideWorkImagePath,
      overlay: SidworkformComponent,
    }, {
      title: 'ทำงานล่วงเวลา',
      img: LayoutConstants.overtimeImagePath,
      overlay: OvertimeworkformComponent,
    }, {
      title: 'ประวัติการลงเวลา',
      img: LayoutConstants.historyImagePath,
      overlay: '',
    }
  ]
  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  openDialog(overlay: ComponentType<unknown>): void {
    const configDialog: MatDialogConfig<any> = {
      // width: '100vw',
    }
    const dialogRef = this.dialog.open(overlay, configDialog);

    dialogRef.beforeClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

  }

}
