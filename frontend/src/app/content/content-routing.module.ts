import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { ContentComponent } from './content.component';
import { AuthGuard } from '../shared/guard/auth.guard';


const routes: Routes = [
      {
            path: 'home',
            component: ContentComponent,
            canActivate: [AuthGuard],
            children: [
                  {
                        path: '',
                        component: ContentComponent,
                  },
                
            ]
      }
]

@NgModule({
      imports: [RouterModule.forChild(routes)],
      exports: [RouterModule]
})
export class ContentRoutingModule {
}