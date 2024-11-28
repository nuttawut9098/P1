import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableqaRoutingModule } from './tableqa-routing.module';
import { QatableComponent } from './qatable/qatable.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { TableqaComponent } from './tableqa.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [
    TableqaComponent,QatableComponent
  ],
  imports: [
    CommonModule,
    TableqaRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    MatPaginatorModule,
    MatTableModule,
  ]
})
export class TableqaModule { }
