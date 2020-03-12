import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatNativeDateModule, MatRippleModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
//material
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from "ngx-mat-datetime-picker";
import { MessageService } from "primeng/api";
import { MessageModule } from "primeng/message";
import { MessagesModule } from "primeng/messages";
import { ToastModule } from "primeng/toast";
import { AuthGuard } from "../shared/guard/auth.guard";
import { SideworkService } from "../shared/service/sidework.service";
import { SharedModule } from "../shared/shared.module";
import { ConfirmdialogComponent } from "./confirmdialog/confirmdialog.component";
import { ContentRoutingModule } from "./content-routing.module";
import { ContentComponent } from "./content.component";
import { HomeComponent } from "./home/home.component";
import { OvertimeworkformComponent } from "./overtimeworkform/overtimeworkform.component";
import { SideworkformComponent } from "./sideworkform/sideworkform.component";
import { SigninComponent } from "./signin/signin.component";

@NgModule({
  declarations: [
    ContentComponent,
    SigninComponent,
    HomeComponent,
    SideworkformComponent,
    OvertimeworkformComponent,
    ConfirmdialogComponent
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
    NgxMatTimepickerModule
  ],
  providers: [AuthGuard, MessageService, SideworkService],
  exports: [ContentComponent]
})
export class ContentModule {}
