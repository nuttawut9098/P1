import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../../shared/service/data.service'
import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material/paginator';
export interface DataTableItem {
  id?: number;
  portion: string;
  no: number;
  items: string;
  item_remind: string;
  rank: string;
  qa_network: string;
  sub_seq: string;
  item_seq: string;
  item_type: string;
  item_detail: string;
  status?: string|null;
  shift?: string;
  date?: Date|string;
}


@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
    standalone: false
})
export class ListComponent implements OnInit {
  data: DataTableItem[] = [];
  sortedData: DataTableItem[] = [];
  @Input() sidebarVisible: boolean = false;
  filter: string = '';
  isSidebarCollapsed: boolean = false;
  sortDirection: string = 'asc';
  p: number = 1; // Current page number
  pageSize: number = 5; // Items per page
  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadDataFromDatabase();
    
  }

  loadDataFromDatabase() {
    this.dataService.getAllItems().subscribe(
      (items: DataTableItem[]) => {
        this.data = items; // ข้อมูลที่ดึงมาจะถูกเรียงตาม sub_seq และ item_seq
        this.sortedData = [...this.data];
      },
      (error: any) => {
        console.error('Error loading data:', error);
      }
    );
  }
  
  

  deleteItem(item: DataTableItem) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF0000',
      cancelButtonColor: '#808080',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataService.deleteItem(item.sub_seq, item.item_seq).subscribe(
          () => {
            this.data = this.data.filter(i => i !== item);
            this.sortedData = [...this.data];
            Swal.fire(
              'Deleted!',
              'The item has been deleted.',
              'success'
            );
          },
          (error: any) => {
            console.error('Error deleting item:', error);
            Swal.fire(
              'Error!',
              'There was an issue deleting the item.',
              'error'
            );
          }
        );
      }
    });
  }
  // เพิ่มข้อมูล
  addItem(item: DataTableItem) {
    this.dataService.addItem(item).subscribe(
      (newItem: DataTableItem) => {
        this.data.push(newItem);
        this.sortedData = [...this.data];
      },
      (error: any) => {
        console.error('Error adding item:', error);
      }
    );
  }

  // อัปเดตข้อมูลในฐานข้อมูล
  updateItem(item: DataTableItem) {
    this.dataService.updateItem(item).subscribe(
      (updatedItem: DataTableItem) => {
        const index = this.data.findIndex(i => i.sub_seq === updatedItem.sub_seq && i.item_seq === updatedItem.item_seq);
        if (index !== -1) {
          this.data[index] = updatedItem;
          this.sortedData = [...this.data];
        }
      },
      (error: any) => {
        console.error('Error updating item:', error);
      }
    );
  }

 
  sortDataBySubSeqAndItemSeq(): void {
    const isAsc = this.sortDirection === 'asc';
  
    // ทำการเรียงข้อมูล
    this.sortedData = [...this.data]; // คัดลอกข้อมูลเดิมมา
    this.sortedData.sort((a, b) => {
      // แปลงค่า sub_seq ให้เป็น number
      const subSeqA = a.sub_seq != null ? parseFloat(a.sub_seq.toString()) : 0;
      const subSeqB = b.sub_seq != null ? parseFloat(b.sub_seq.toString()) : 0;
  
      // แปลงค่า item_seq ให้เป็น number
      const itemSeqA = a.item_seq != null ? parseInt(a.item_seq.toString(), 10) : 0;
      const itemSeqB = b.item_seq != null ? parseInt(b.item_seq.toString(), 10) : 0;
  
      // เปรียบเทียบ sub_seq ก่อน
      const subSeqComparison = subSeqA - subSeqB;
      if (subSeqComparison !== 0) {
        return isAsc ? subSeqComparison : -subSeqComparison;
      }
  
      // ถ้า sub_seq เท่ากัน ให้เปรียบเทียบ item_seq
      return isAsc ? itemSeqA - itemSeqB : itemSeqB - itemSeqA;
    });
  
    // สลับทิศทางการเรียง
    this.sortDirection = isAsc ? 'desc' : 'asc';
  
    // รีเซ็ตหน้าเป็นหน้าแรก
    this.p = 1;
  }
  
  setPage(event: PageEvent): void {
    this.p = event.pageIndex + 1; // pageIndex เป็น 0-based index
    this.pageSize = event.pageSize;  // ขนาดของหน้า
  }
  
  get filteredData(): DataTableItem[] {
    // แสดงข้อมูลทั้งหมดที่ถูกเรียงแล้ว โดยไม่ใช้ slice ที่นี่
    return this.sortedData;
  }
  

  
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
