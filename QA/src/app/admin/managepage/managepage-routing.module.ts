import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagepageComponent } from './managepage.component';
import { FormComponent } from './form/form.component';
import { AddformComponent } from './addform/addform.component';


const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  {path:'',component:ManagepageComponent},
  { path: 'edit/:sub_seq/:item_seq', component: FormComponent },
  { path: 'addform', component: AddformComponent }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagepageRoutingModule { }
