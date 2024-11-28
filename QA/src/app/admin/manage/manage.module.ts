import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormComponent } from './form/form.component';
import { ManageRoutingModule } from './manage-routing.module'; // นำเข้ารูท
import { ManageComponent } from './manage.component';
import { LisstComponent } from './lisst/lisst.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [ManageComponent,FormComponent, LisstComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    ManageRoutingModule,
    MatPaginatorModule,
    MatTableModule,
  ]
})
export class ManageModule { }
