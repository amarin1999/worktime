// angular module
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


// primeng
import { SidebarModule } from 'primeng/sidebar';


// material
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';



// fontawesome
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebook, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { faClock, faHistory } from '@fortawesome/free-solid-svg-icons'
import { EmployeeService } from './service/employee.service';
import { AuthService } from './service/auth.service';


@NgModule({
  declarations: [],
  imports: [

  ],

  exports: [
    CommonModule,
    RouterModule,
    SidebarModule,
    FontAwesomeModule,
    MatGridListModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatTooltipModule,
    HttpClientModule,
  ],
  providers: [EmployeeService, AuthService]
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faTwitter,
      faYoutube,
      faFacebook,
      faClock,
      faHistory
    );
  }
}
