import { LOCALE_ID, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
//route
import { AppRoutingModule } from "./app-routing.module";
//component
import { AppComponent } from "./app.component";
import { ContentModule } from "./content/content.module";
// sub module
import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ContentModule,
    AppRoutingModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production
    }),
    CoreModule,
    SharedModule,
    BrowserAnimationsModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: "th-TH" }],
  bootstrap: [AppComponent]
})
export class AppModule { }
