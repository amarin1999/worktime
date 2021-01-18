import { Component, OnInit, Input } from "@angular/core";
import { LayoutConstants } from "src/app/shared/constants/LayoutConstants";

@Component({
  selector: "app-banner",
  templateUrl: "./banner.component.html",
  styleUrls: ["./banner.component.scss"]
})
export class BannerComponent implements OnInit {
  @Input("text") textField: string;
  cdgImagePath: string = LayoutConstants.cdgImagePath;

  constructor() {}

  ngOnInit(): void {}
}
