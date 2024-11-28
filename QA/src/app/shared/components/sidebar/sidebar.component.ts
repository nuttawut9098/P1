import { Component, Input } from '@angular/core';
import { SidebarService } from '../../service/sidebar.service';
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
    standalone: false
})
export class SidebarComponent {
  accordionVisible: boolean = false;
  constructor(public sidebarService: SidebarService) {}

  toggleSidebar() {
    this.sidebarService.toggleSidebar(); // สลับสถานะ Sidebar
  }

  get isCollapsed(): boolean {
    return this.sidebarService.getSidebarState(); // ใช้ Getter เพื่อเช็คสถานะ
  }

  // Toggle Accordion
  toggleAccordion() {
    this.accordionVisible = !this.accordionVisible;
  }

  @Input() navItems: any = [
    { name: 'Admin', path: '/admin' },
    { name: 'User', path: '/user' },
  ];
  @Input() username: string = '';
}
