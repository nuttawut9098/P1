import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

const routes: Routes = [{
  path: '',
  component: AdminComponent,
  children: [
    { path: '', redirectTo: '', pathMatch: 'full' },
    {
      path: 'managepage',
      loadChildren: () =>
        import('./managepage/managepage.module').then(
          (m) => m.ManagepageModule
        ),
    },
    {
      path: 'manage',
      loadChildren: () =>
        import('./manage/manage.module').then(
          (m) => m.ManageModule
        ),
    },
    {
      path: 'setting',
      loadChildren: () =>
        import('./setting/setting.module').then(
          (m) => m.SettingModule
        ),
    },
  ],
},
    
  ];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
