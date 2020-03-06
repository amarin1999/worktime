import { NgModule } from '@angular/core';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LabelComponent } from './label/label.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    LabelComponent
  ],
  imports: [    
    SharedModule
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    LabelComponent
  ]

})
export class CoreModule { }
