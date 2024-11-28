import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingRoutingModule } from './setting-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { SettingComponent } from './setting.component';
import { TimeresetComponent } from './timereset/timereset.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [SettingComponent,TimeresetComponent],
  imports: [
    CommonModule,
    SettingRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SettingModule { }
