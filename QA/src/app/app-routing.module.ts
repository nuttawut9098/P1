import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LogoutComponent } from './logout/logout.component';

const routes: Routes = [ {
  path: '', component: AppComponent,
  children: [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
      path: 'user',
      loadChildren: () =>
        import('./user/user.module').then(
          (m) => m.UserModule
        ),
      
    },
    {
      path: 'admin',
      loadChildren: () =>
        import('./admin/admin.module').then(
          (m) => m.AdminModule
        ),
      
    },
    {
      path: 'register',
      loadChildren: () =>
        import('./register/register.module').then(
          (m) => m.RegisterModule
        ),
      
    },
    {
      path: 'login',
      loadChildren: () =>
        import('./login/login.module').then(
          (m) => m.LoginModule
        )
    },
    {
      path: 'logout',
      component:LogoutComponent
    },
  ],
  }
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
