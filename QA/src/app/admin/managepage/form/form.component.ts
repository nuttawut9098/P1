import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService, DataTableItem } from '../../../shared/service/data.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    standalone: false
})
export class FormComponent implements OnInit {
  TaData: DataTableItem = {
    portion: '',
    no: 0,
    items: '',
    item_remind: '',
    rank: '',
    qa_network: '',
    sub_seq: '',
    item_seq: '',
    item_type: '',
    item_detail: '',
  };

  constructor(private route: ActivatedRoute, private dataService: DataService) {}

  ngOnInit(): void {
    const subSeq = this.route.snapshot.paramMap.get('sub_seq');
    const itemSeq = this.route.snapshot.paramMap.get('item_seq');
    if (subSeq && itemSeq) {
      this.loadData(subSeq, itemSeq);
    }
  }

  loadData(subSeq: string, itemSeq: string): void {
    this.dataService.getItem(subSeq, itemSeq).subscribe(
      (data: DataTableItem) => {
        this.TaData = data;
      },
      (error) => {
        console.error(`Error loading data for sub_seq ${subSeq} and item_seq ${itemSeq}:`, error);
      }
    );
  }
  onSubmit(): void {
    if (this.TaData.sub_seq && this.TaData.item_seq) {
      this.dataService.updateItem(this.TaData).subscribe(
        (updatedData: DataTableItem) => {
          console.log('Data updated:', updatedData);
  
          // SweetAlert2 แสดงข้อความสำเร็จ
          Swal.fire({
            icon: 'success',
            title: 'อัปเดตข้อมูลสำเร็จ',
            text: 'ข้อมูลของคุณได้รับการอัปเดตเรียบร้อยแล้ว',
          });
        },
        (error) => {
          console.error('Error updating data:', error);
  
          // SweetAlert2 แสดงข้อผิดพลาด
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถอัปเดตข้อมูลได้ กรุณาลองใหม่',
          });
        }
      );
    } else {
      console.log('Invalid form');
  
      // SweetAlert2 แสดงข้อผิดพลาดเมื่อฟอร์มไม่ถูกต้อง
      Swal.fire({
        icon: 'warning',
        title: 'ฟอร์มไม่ถูกต้อง',
        text: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน',
      });
    }
  }
}  