import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from '../../../shared/service/data.service';  // import DataService
import Swal from 'sweetalert2';

@Component({
    selector: 'app-addform',
    templateUrl: './addform.component.html',
    styleUrl: './addform.component.scss',
    standalone: false
})
export class AddformComponent {
  addItemForm: FormGroup;

  constructor(private fb: FormBuilder, private dataService: DataService) {
    this.addItemForm = this.fb.group({
      portion: [''],
      no: [''],
      items: [''],
      item_remind: [''],
      rank: [''],
      qa_network: [''],
      sub_seq: [''],
      item_seq: [''],
      item_type: [''],
      item_detail: ['']
    });
  }

  onSubmit(): void {
    const formData = this.addItemForm.value;
  
    // เรียกใช้ฟังก์ชัน addItem() ใน DataService เพื่อเพิ่มข้อมูลในฐานข้อมูล
    this.dataService.addItem(formData).subscribe(
      (newItem) => {
        // ใช้ SweetAlert2 แสดงข้อความสำเร็จ
        Swal.fire({
          icon: 'success',
          title: 'เพิ่มข้อมูลสำเร็จ',
          text: 'ข้อมูลของคุณถูกเพิ่มเรียบร้อยแล้ว!',
        });
  
        this.addItemForm.reset();  // รีเซ็ตฟอร์มหลังจากเพิ่มข้อมูล
      },
      (error) => {
        console.error('Error adding item:', error);
  
        // ใช้ SweetAlert2 แสดงข้อผิดพลาด
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถเพิ่มข้อมูลได้ กรุณาลองใหม่',
        });
      }
    );
  }
  
}
