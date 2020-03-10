import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ContentComponent } from './content.component';
import { SigninComponent } from './signin/signin.component';
import { ContentRoutingModule } from './content-routing.module';
import { AuthGuard } from '../shared/guard/auth.guard';
import { MessageService } from 'primeng/api';
import { HomeComponent } from './home/home.component';
@NgModule({
  declarations: [
    ContentComponent,
    SigninComponent,
    HomeComponent,
  ],
  imports: [
    SharedModule,
    ContentRoutingModule,
  ],
  providers: [AuthGuard, MessageService],
  exports: [
    ContentComponent,
  ]
})
export class ContentModule { }
