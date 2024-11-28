import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    styleUrl: './logout.component.scss',
    standalone: false
})
export class LogoutComponent implements OnInit {
  constructor(private user:DataService,private router:Router){
    
  }
  ngOnInit(): void{
    
    this.router.navigate(['/login'])
  }

}
