import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { ContentComponent } from './content.component';


const routes: Routes = [
      {
            path: '',
            component: ContentComponent,
            children: [
                  {
                        path: 'home',
                        component: SigninComponent,
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