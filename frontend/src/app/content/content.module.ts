//module
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CoreModule } from "../core/core.module";
//material
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatTabsModule } from "@angular/material/tabs";
import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
  NgxMatNativeDateModule
} from "@angular-material-components/datetime-picker";
import { MatSortModule } from "@angular/material/sort";
import { MatListModule } from "@angular/material/list";
import { MatBadgeModule } from "@angular/material/badge";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatNativeDateModule, MatRippleModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDividerModule } from "@angular/material/divider";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
//primgng
import { MessageService } from "primeng/api";
import { MessageModule } from "primeng/message";
import { MessagesModule } from "primeng/messages";
import { ToastModule } from "primeng/toast";
import { CalendarModule } from "primeng/calendar";
//guard
import { AuthGuard } from "../shared/guard/auth.guard";
//service
import { SideWorkService } from "../shared/service/sidework.service";
import { SharedModule } from "../shared/shared.module";
import { OvertimeWorkService } from "../shared/service/overtime.service";
//component
import { ConfirmDialogComponent } from "./confirmdialog/confirmdialog.component";
import { ContentComponent } from "./content.component";
import { HomeComponent } from "./home/home.component";
import { OvertimeworkformComponent } from "./overtimeworkform/overtimeworkform.component";
import { SignInComponent } from "./signin/signin.component";
import { SideWorkComponent } from "./sidework/sidework.component";
import { SideWorkFormComponent } from "./sidework/sideworkform/sideworkform.component";
import { HistoryComponent } from "./history/history.component";
import { HistoryOvertimeWorkComponent } from "./history/history-overtime-work/history-overtime-work.component";
//route
import { ContentRoutingModule } from "./content-routing.module";
//pipe
import { WorkAnywherePipe } from "../shared/pipe/work-anywhere.pipe";
import { EditWorkComponent } from "./edit-work/edit-work.component";
import { EditSideWorkComponent } from "./edit-work/edit-side-work/edit-side-work.component";
import { HistorySideWorkComponent } from "./history/history-side-work/history-side-work.component";
import { SideWorkPastFormComponent } from "./sidework/side-work-past-form/side-work-past-form.component";
@NgModule({
  declarations: [
    ContentComponent,
    SignInComponent,
    HomeComponent,
    SideWorkFormComponent,
    OvertimeworkformComponent,
    ConfirmDialogComponent,
    SideWorkComponent,
    HistoryComponent,
    HistorySideWorkComponent,
    HistoryOvertimeWorkComponent,
    EditWorkComponent,
    EditSideWorkComponent,
    SideWorkPastFormComponent
  ],

  imports: [
    SharedModule,
    CoreModule,
    ContentRoutingModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    ReactiveFormsModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    MatRippleModule,
    MatCheckboxModule,
    MatTabsModule,
    MatListModule,
    MatBadgeModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    //DateTime
    MatDatepickerModule,
    NgxMaterialTimepickerModule,
    MatNativeDateModule,
    NgxMatNativeDateModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule
  ],
  entryComponents: [
    SideWorkComponent,
    OvertimeworkformComponent,
    ConfirmDialogComponent
  ],
  providers: [
    AuthGuard,
    MessageService,
    SideWorkService,
    OvertimeWorkService,
    WorkAnywherePipe
  ],
  exports: [ContentComponent]
})
export class ContentModule {}
