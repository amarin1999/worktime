// angular module
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
// material
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
//angular
import { RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
// fontawesome
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
//spinner;
import { NgxSpinnerModule } from "ngx-spinner";
// primeng
import { SidebarModule } from "primeng/sidebar";
import { AuthService } from "./service/auth.service";
//service
import { EmployeeService } from "./service/employee.service";
import { FormatDateThPipe } from "./pipe/format-date-th.pipe";
import { WorkAnywherePipe } from './pipe/work-anywhere.pipe';

@NgModule({
  declarations: [FormatDateThPipe, WorkAnywherePipe],
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
    FormatDateThPipe,
    WorkAnywherePipe
  ],
  providers: [EmployeeService, AuthService]
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faTwitter, faYoutube, faFacebook, faClock, faHistory);
  }
}
