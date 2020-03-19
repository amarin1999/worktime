import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HistoryComponent } from "./content/history/history.component";
import { SigninComponent } from "./content/signin/signin.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "main",
    pathMatch: "full"
  },

  {
    path: "signin",
    component: SigninComponent
  },
  // {
  //   path: "**",
  //   component: HistoryComponent
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
