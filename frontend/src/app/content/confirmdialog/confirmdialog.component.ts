import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-confirmdialog",
  templateUrl: "./confirmdialog.component.html",
  styleUrls: ["./confirmdialog.component.scss"]
})
export class ConfirmdialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ConfirmdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public confirmData: { textConfirm: string }
  ) {}

  ngOnInit(): void {}
  sendDialogStatus(status: boolean): void {
    this.dialogRef.close(status);
  }
}
