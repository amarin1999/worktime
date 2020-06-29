import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SignInComponent } from "./content/signin/signin.component";
import { PageNotFoundComponent } from "./core/page-not-found/page-not-found.component";
import { SideworkCalendarComponent } from './content/sidework-calendar/sidework-calendar.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "signin", // main
    pathMatch: "full",
  },

  {
    path: "signin",
    component: SignInComponent,
  },
  {
    path: "sidework-calendar",
    component: SideworkCalendarComponent,
  },
  {
    path: "**",
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: "enabled"
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
