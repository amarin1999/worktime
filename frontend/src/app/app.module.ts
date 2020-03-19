import { LOCALE_ID, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
//component
import { AppComponent } from "./app.component";
// sub module
import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";
import { ContentModule } from "./content/content.module";
//route
import { AppRoutingModule } from "./app-routing.module";
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production
    }),
    CoreModule,
    ContentModule,
    SharedModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: "th-TH" }],
  bootstrap: [AppComponent]
})
export class AppModule {}
