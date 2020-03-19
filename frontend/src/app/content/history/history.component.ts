import { Component, OnInit } from "@angular/core";
import { SideworkService } from "src/app/shared/service/sidework.service";

@Component({
  selector: "app-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.scss"]
})
export class HistoryComponent implements OnInit {
  constructor(private sideWorkService: SideworkService) {}

  ngOnInit(): void {
    this.sideWorkService
      .getHistorySideWork(localStorage.getItem("employeeNo"))
      .subscribe(response => {
        console.log(response);
      });
  }
}
