import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SideWork } from "src/app/shared/interfaces/sidework";
@Component({
  selector: "app-edit-work",
  templateUrl: "./edit-work.component.html",
  styleUrls: ["./edit-work.component.scss"]
})
export class EditWorkComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public dataSideWork: SideWork) {}

  ngOnInit(): void {
    console.log(this.dataSideWork);
  }
}
