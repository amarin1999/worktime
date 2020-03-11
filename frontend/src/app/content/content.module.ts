import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';


//material
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatDateAdapter, NgxMatNativeDateAdapter, NgxMatNativeDateModule } from 'ngx-mat-datetime-picker';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { MatCheckboxModule } from '@angular/material/checkbox';


import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { AuthGuard } from '../shared/guard/auth.guard';
import { SharedModule } from '../shared/shared.module';
import { ContentRoutingModule } from './content-routing.module';


import { ContentComponent } from './content.component';
import { HomeComponent } from './home/home.component';
import { OvertimeworkformComponent } from './overtimeworkform/overtimeworkform.component';
import { SidworkformComponent } from './sidworkform/sidworkform.component';
import { SigninComponent } from './signin/signin.component';




@NgModule({
  declarations: [
    ContentComponent,
    SigninComponent,
    HomeComponent,
    SidworkformComponent,
    OvertimeworkformComponent,
  ],
  imports: [
    SharedModule,
    ContentRoutingModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    ReactiveFormsModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    MatRippleModule,
    MatCheckboxModule,
    //Date
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatNativeDateModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
  ],
  providers: [AuthGuard, MessageService],
  exports: [
    ContentComponent,
  ]
})
export class ContentModule { }
