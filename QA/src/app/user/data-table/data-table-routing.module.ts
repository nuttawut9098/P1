import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataTableComponent } from './data-table.component';

// import { QaformComponent } from './qaform/qaform.component';

const routes: Routes = [
  { path: '', component: DataTableComponent },
  // {path:'qaform',component:QaformComponent},
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataTableRoutingModule { }
