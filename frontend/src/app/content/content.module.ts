import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ContentComponent } from './content.component';
import { SigninComponent } from './signin/signin.component';
import { ContentRoutingModule } from './content-routing.module';

@NgModule({
  declarations: [
    ContentComponent,
    SigninComponent
  ],
  imports: [
    SharedModule,
    ContentRoutingModule,   
  ],
  exports: [
    ContentComponent,
  ]
})
export class ContentModule { }
