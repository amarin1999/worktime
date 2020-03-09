import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ContentComponent } from './content.component';
import { SigninComponent } from './signin/signin.component';
import { ContentRoutingModule } from './content-routing.module';
import { AuthGuard } from '../shared/guard/auth.guard';

@NgModule({
  declarations: [
    ContentComponent,
    SigninComponent,    
  ],
  imports: [
    SharedModule,
    ContentRoutingModule,
  ],
  providers: [AuthGuard],
  exports: [
    ContentComponent,
  ]
})
export class ContentModule { }
