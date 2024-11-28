import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagepageRoutingModule } from './managepage-routing.module';
import { ManagepageComponent } from './managepage.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './form/form.component';
import { ListComponent } from './list/list.component';
import { AddformComponent } from './addform/addform.component';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [ManagepageComponent,FormComponent,
    ListComponent,
    AddformComponent,
    
  ],
  imports: [
    CommonModule,
    ManagepageRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule
  ]
})
export class ManagepageModule { }
