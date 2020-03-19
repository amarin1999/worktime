import { Component, OnInit } from "@angular/core";
import { SideWorkService } from "src/app/shared/service/sidework.service";
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


@Component({
  selector: "app-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.scss"]
})

export class HistoryComponent implements OnInit {

  constructor(private sideWorkService: SideWorkService) {}
  

  ngOnInit(): void {
    
    this.sideWorkService
      .getHistorySideWork(localStorage.getItem("employeeNo"))
      .subscribe(response => {
        console.log({response});
      });
  }
}
