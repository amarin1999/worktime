// angular module
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";

// material
import { MatGridListModule } from "@angular/material/grid-list";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from "@angular/material/card";

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

//service
import { EmployeeService } from "./service/employee.service";
import { AuthService } from "./service/auth.service";

@NgModule({
  declarations: [],
  imports: [],

  exports: [
    CommonModule,
    RouterModule,
    SidebarModule,
    FontAwesomeModule,
    MatGridListModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatTooltipModule,
    MatIconModule,
    HttpClientModule,
    NgxSpinnerModule
  ],
  providers: [EmployeeService, AuthService]
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faTwitter, faYoutube, faFacebook, faClock, faHistory);
  }
}
