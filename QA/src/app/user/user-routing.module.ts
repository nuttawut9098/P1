import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: '', redirectTo: '', pathMatch: 'full' }, 
      // {
      //   path: 'data-table',
      //   loadChildren: () =>
      //     import('./data-table/data-table.module').then(m => m.DataTableModule), 
      // },
      {
        path: 'tableqa',
        loadChildren: () =>
          import('./tableqa/tableqa.module').then(m => m.TableqaModule), 
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
