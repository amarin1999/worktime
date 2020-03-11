import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/guard/auth.guard';
import { ContentComponent } from './content.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
      {
            path: 'home',
            component: HomeComponent,
            canActivate: [AuthGuard],
            children: [
                  {
                        path: 'ss',
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