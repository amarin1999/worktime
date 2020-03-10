import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './content/signin/signin.component';
import { SigninGuard } from './shared/guard/signin.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  {
    path: "signin",
    component: SigninComponent
  },
  {
    path: "**",
    redirectTo: 'home',
    pathMatch: 'full'
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
  })],
  exports: [RouterModule],

})
export class AppRoutingModule { }
