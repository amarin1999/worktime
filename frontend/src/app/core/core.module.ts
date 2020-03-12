import { NgModule } from '@angular/core';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
 
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
