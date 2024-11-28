import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../shared/service/sidebar.service';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss',
    standalone: false
})
export class AdminComponent implements OnInit {
  userDetail:any;
  isCollapsed: boolean = false;

  constructor(private sidebarService: SidebarService) {
    this.sidebarService.isCollapsed$.subscribe(
      (state) => (this.isCollapsed = state)
    );
  }
  ngOnInit(): void {
      const user = localStorage.getItem('currentUser');
      if (user) {
        this.userDetail = JSON.parse(user);
      } else {
        this.userDetail = null;
      }
  }
  
  navItems: any = [
    { name: 'ManageMaster', path: './managepage', icon: 'fa fa-wpforms' },
    { name: 'ManageUser', path:'./manage', icon: 'fa fa-wpforms' },
    { name: 'SetTime', path:'./setting', icon: 'fa fa-clock-o' },
  ];
  
}
