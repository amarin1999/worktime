import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HistoryComponent } from "./content/history/history.component";
import { SignInComponent } from "./content/signin/signin.component";
import { NavbarComponent } from './core/navbar/navbar.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "main",
    pathMatch: "full"
  },

  {
    path: "signin",
    component: SignInComponent
  },
  {
    path: "**",
    component: NavbarComponent
  }
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
