import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components';
import { RouterModule } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { DataService } from './service/data.service';


@NgModule({
  declarations: [SidebarComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports:[
    SidebarComponent,MatIconModule
  ],
  providers: [DataService]
})
export class SharedModule { }
