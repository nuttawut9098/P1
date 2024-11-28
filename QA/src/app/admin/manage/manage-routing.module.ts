import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent } from './manage.component';
import { FormComponent } from './form/form.component';

const routes: Routes = [
  
  { path: '', component: ManageComponent },
  { path: 'edit', component: FormComponent },
  { path: 'edit/:username', component: FormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule { }
