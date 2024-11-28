import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimeresetComponent } from './timereset/timereset.component';

const routes: Routes = [
  {path:'',component:TimeresetComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
