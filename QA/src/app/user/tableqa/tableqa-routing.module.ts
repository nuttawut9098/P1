import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableqaComponent } from './tableqa.component';
import { QatableComponent } from './qatable/qatable.component';

const routes: Routes = [
  {path:'',component:TableqaComponent}
  ,{path:'qatable',component:QatableComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TableqaRoutingModule { }
