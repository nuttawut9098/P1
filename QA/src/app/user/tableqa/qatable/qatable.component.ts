import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { QaformService } from '../../../shared/service/qaform.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-qatable',
    templateUrl: './qatable.component.html',
    styleUrl: './qatable.component.scss',
    standalone: false
})
export class QatableComponent implements OnInit, OnDestroy {
  datatable: any[] = [];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  selectedFile: File | null = null;
  currentDate: Date = new Date();
  currentShift: string = '';
  timeInterval: any;

  currentPage: number = 1;
  itemsPerPage: number = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  paginatedData: any[] = [];

  unsavedChanges: { subSeq: number; itemSeq: number; status: string; remark?: string; path?: string }[] = [];
  hasUnsavedChanges: boolean = false;

  constructor(private qaformService: QaformService) {}

  ngOnInit(): void {
    this.loadShift();
    this.startRealTimeClock();
    this.qaformService.getData().subscribe({
      next: (data) => {
        this.datatable = data.sort(
          (a, b) =>
            parseFloat(a.sub_seq) - parseFloat(b.sub_seq) ||
            parseInt(a.item_seq, 10) - parseInt(b.item_seq, 10)
        );

        this.datatable.forEach((item) => {
          if (!item.status) {
            item.status = '';
          }
        });

        this.updatePagination();
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        Swal.fire({
          icon: 'error',
          title: 'ไม่สามารถโหลดข้อมูลได้',
          text: 'กรุณาลองอีกครั้งภายหลัง',
        });
      },
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.timeInterval);
  }
  getButtonLabel(subSeq: number, itemSeq: number): string {
    const item = this.datatable.find(i => i.sub_seq === subSeq && i.item_seq === itemSeq);
    if (item) {
      switch (item.status) {
        case 'OK':
          return 'OK';
        case 'NG':
          return 'NG';
        default:
          return ''; // ค่าว่าง
      }
    }
    return '';
  }
  
  updateRemark(subSeq: number, itemSeq: number, remark: string): void {
    const item = this.unsavedChanges.find((change) => change.subSeq === subSeq && change.itemSeq === itemSeq);
    if (item) {
      item.remark = remark;
    } else {
      this.unsavedChanges.push({ subSeq, itemSeq, status: 'NG', remark });
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.datatable.length / this.itemsPerPage);
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedData = this.datatable.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  areAllStatusesFilled(): boolean {
    return this.datatable.every((item) => item.status !== '');
  }

  toggleStatus(subSeq: string, itemSeq: string): void {
    const item = this.datatable.find((i) => i.sub_seq.toString() === subSeq && i.item_seq.toString() === itemSeq);
    if (item) {
      switch (item.status) {
        case '':
          item.status = 'OK';
          break;
        case 'OK':
          item.status = 'NG';
          break;
        case 'NG':
        default:
          item.status = '';
          break;
      }

      const existingChange = this.unsavedChanges.find(
        (change) => change.subSeq === parseFloat(subSeq) && change.itemSeq === parseInt(itemSeq, 10)
      );

      if (existingChange) {
        existingChange.status = item.status;
      } else {
        this.unsavedChanges.push({
          subSeq: parseFloat(subSeq),
          itemSeq: parseInt(itemSeq, 10),
          status: item.status,
        });
      }

      this.hasUnsavedChanges = this.unsavedChanges.length > 0;
    }
  }

  saveChanges(): void {
    if (!this.areAllStatusesFilled()) {
      Swal.fire({
        icon: 'warning',
        title: 'สถานะไม่ครบถ้วน',
        text: 'กรุณากำหนดสถานะ (OK/NG) ให้ครบทุกแถวก่อนบันทึก',
      });
      return;
    }
  
    if (this.unsavedChanges.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'ไม่มีการเปลี่ยนแปลง',
        text: 'คุณยังไม่ได้เปลี่ยนแปลงข้อมูลใดๆ',
      });
      return;
    }
  
    const payload = {
      changes: this.unsavedChanges.map((change) => ({
        subSeq: change.subSeq,
        itemSeq: change.itemSeq,
        status: change.status,
        remark: change.remark || '',
        path: change.path || '', // จะส่ง path ว่างไว้ก่อน
      })),
      shift: this.currentShift,
      date: this.currentDate.toISOString().split('T')[0],
    };
  
    // ส่งข้อมูล JSON ไปยัง backend
    this.qaformService.saveChangesWithShiftAndDate(payload).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'บันทึกสำเร็จ',
          text: 'การเปลี่ยนแปลงถูกบันทึกแล้ว',
        });
  
        // ล้างข้อมูลหลังจากบันทึกสำเร็จ
        this.unsavedChanges = [];
        this.hasUnsavedChanges = false;
      },
      error: (error) => {
        console.error('Error saving changes:', error);
        Swal.fire({
          icon: 'error',
          title: 'บันทึกล้มเหลว',
          text: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
        });
      },
    });
  }
  
  updateFilePath(event: Event, item: any): void {
    const input = event.target as HTMLInputElement;
  
    // ตรวจสอบว่า input มีไฟล์หรือไม่
    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileName = file.name; // ใช้ชื่อไฟล์แทน path
  
      // อัปเดต path ใน item ที่เกี่ยวข้อง
      item.path = fileName; // ใช้ชื่อไฟล์แทน
      const existingChange = this.unsavedChanges.find(
        (change) => change.subSeq === item.sub_seq && change.itemSeq === item.item_seq
      );
  
      if (existingChange) {
        existingChange.path = fileName; // อัปเดต path
      } else {
        this.unsavedChanges.push({
          subSeq: item.sub_seq,
          itemSeq: item.item_seq,
          status: item.status,
          remark: item.remark || '',
          path: fileName, // เพิ่มเฉพาะชื่อไฟล์
        });
      }
  
      // แสดงผลลัพธ์ในคอนโซล (ถ้าจำเป็น)
      console.log('Updated file name:', fileName);
    }
  }
  
  
  

  canSaveChanges(): boolean {
    return this.areAllStatusesFilled() && this.unsavedChanges.length > 0;
  }

  isActionAllowed(subSeq: string, itemSeq: string): boolean {
    const currentSubSeq = parseFloat(subSeq);
    const currentItemSeq = parseInt(itemSeq, 10);

    const sortedItems = [...this.datatable].sort(
      (a, b) =>
        parseFloat(a.sub_seq) - parseFloat(b.sub_seq) ||
        parseInt(a.item_seq, 10) - parseInt(b.item_seq, 10)
    );

    return sortedItems.every((item) => {
      const itemSubSeq = parseFloat(item.sub_seq);
      const itemItemSeq = parseInt(item.item_seq, 10);

      if (itemSubSeq < currentSubSeq || (itemSubSeq === currentSubSeq && itemItemSeq < currentItemSeq)) {
        return item.status === 'OK' || item.status === 'NG';
      }
      return true;
    });
  }

  loadShift(): void {
    this.qaformService.getCurrentShift().subscribe({
      next: (data) => {
        this.currentShift = data.shift;
      },
      error: (error) => {
        console.error('Error fetching shift:', error);
      },
    });
  }

  startRealTimeClock(): void {
    this.timeInterval = setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
  }
}
