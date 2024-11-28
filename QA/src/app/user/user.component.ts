import { Component } from '@angular/core';
import { SidebarService } from '../shared/service/sidebar.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss',
    standalone: false
})
export class UserComponent {
  userDetail: any;
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
  navItems:any=[
    // {name:'Qaform', path:'./data-table',icon:'fas fa-clipboard-check'},
    { name: 'Qaform', path:'./tableqa', icon: 'fas fa-clipboard-check' },
  ];
}