import { Component, OnInit } from '@angular/core';
import { DataService } from './shared/service/data.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    standalone: false
})
export class AppComponent implements OnInit {
  data: any = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadData();  
  }

  loadData(): void {
    this.dataService.getData().subscribe(response => {
      this.data = response;
    });
  }
}
