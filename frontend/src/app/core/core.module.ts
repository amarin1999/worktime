import { NgModule } from '@angular/core';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SharedModule } from '../shared/shared.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    PageNotFoundComponent,
 
  ],
  imports: [    
    SharedModule
  ],
  exports: [
    NavbarComponent,
    FooterComponent,   
  ]

})
export class CoreModule { }
