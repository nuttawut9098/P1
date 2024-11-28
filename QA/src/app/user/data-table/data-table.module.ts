import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataTableRoutingModule } from './data-table-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { DataTableComponent } from './data-table.component';
// import { QaformComponent } from './qaform/qaform.component';




@NgModule({
  declarations: [
    DataTableComponent,
    // QaformComponent,

  ],
  imports: [
    CommonModule,
    DataTableRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class DataTableModule { }
