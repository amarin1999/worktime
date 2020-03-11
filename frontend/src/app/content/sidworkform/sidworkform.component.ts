import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LayoutConstants } from 'src/app/shared/constants/LayoutConstants';

@Component({
  selector: 'app-sidworkform',
  templateUrl: './sidworkform.component.html',
  styleUrls: ['./sidworkform.component.scss']
})

export class SidworkformComponent implements OnInit {
  formGrid = LayoutConstants.gridFormPrimeNg;
  constructor(
    public dialogRef: MatDialogRef<SidworkformComponent>,
  ) { }

  ngOnInit(): void {
  }

}
