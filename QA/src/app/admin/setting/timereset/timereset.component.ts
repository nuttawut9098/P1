import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-timereset',
    templateUrl: './timereset.component.html',
    styleUrl: './timereset.component.scss',
    standalone: false
})
export class TimeresetComponent {
  resetTime = { hour: null, minute: null }; // ฟอร์มกรอกแค่ 1 เวลา

  constructor(private http: HttpClient) {}

  onSubmit() {
    if (this.resetTime.hour !== null && this.resetTime.minute !== null) {
      this.http
        .post('http://localhost:3000/reset-time', this.resetTime)
        .subscribe(
          (response) => {
            alert('เวลาถูกบันทึกเรียบร้อย');
          },
          (error) => {
            console.error('เกิดข้อผิดพลาดในการบันทึกเวลา:', error);
            alert('ไม่สามารถบันทึกเวลาได้');
          }
        );
    } else {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    }
  }
}