//angular module
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
//material
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
//fontawesome
import {
  FaIconLibrary,
  FontAwesomeModule
} from "@fortawesome/angular-fontawesome";
import {
  faFacebook,
  faTwitter,
  faYoutube
} from "@fortawesome/free-brands-svg-icons";
import { faClock, faHistory } from "@fortawesome/free-solid-svg-icons";
//spinner
import { NgxSpinnerModule } from "ngx-spinner";
//primeng
import { SidebarModule } from "primeng/sidebar";
import { AuthService } from "./service/auth.service";
import { ScrollPanelModule } from "primeng/scrollpanel";
//service
import { EmployeeService } from "./service/employee.service";
//pipe
import { WorkAnywherePipe } from "./pipe/work-anywhere.pipe";
import { FormatYearPipe } from './pipe/format-year.pipe';
import { FormatYearOtPipe } from './pipe/format-year-ot.pipe';
import { WorkTypePipe } from './pipe/work-type.pipe';


@NgModule({
  declarations: [WorkAnywherePipe, FormatYearPipe, FormatYearOtPipe, WorkTypePipe],
  imports: [],

  exports: [
    CommonModule,
    RouterModule,
    SidebarModule,
    FontAwesomeModule,
    MatGridListModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatTooltipModule,
    MatIconModule,
    HttpClientModule,
    NgxSpinnerModule,
    WorkAnywherePipe,
    ScrollPanelModule,
    FormatYearPipe,
    FormatYearOtPipe,
    WorkTypePipe
  ],
  providers: [EmployeeService, AuthService]
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faTwitter, faYoutube, faFacebook, faClock, faHistory);
  }
}
