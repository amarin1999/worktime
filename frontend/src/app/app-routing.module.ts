import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SignInComponent } from "./content/signin/signin.component";
import { PageNotFoundComponent } from "./core/page-not-found/page-not-found.component";

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
    component: PageNotFoundComponent
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
