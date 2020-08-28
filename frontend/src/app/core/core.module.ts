import { NgModule } from "@angular/core";
import { FooterComponent } from "./footer/footer.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { SharedModule } from "../shared/shared.module";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { BannerComponent } from "./banner/banner.component";

import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    PageNotFoundComponent,
    BannerComponent
  ],
  imports: [
    SharedModule,
    ButtonModule
  ],
  exports: [NavbarComponent, FooterComponent, BannerComponent]
})
export class CoreModule { }
