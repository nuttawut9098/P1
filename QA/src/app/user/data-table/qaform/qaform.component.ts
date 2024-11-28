// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { QaformService } from '../../../shared/service/qaform.service'; // นำเข้าบริการใหม่

// @Component({
//   selector: 'app-qaform',
//   templateUrl: './qaform.component.html',
//   styleUrls: ['./qaform.component.scss'],
// })
// export class QaformComponent implements OnInit {
//   currentStep: number = 0;
//   form: FormGroup;
//   isLastStep = false;

//   steps: any[] = [];  // ใช้ any[] เพราะรับข้อมูลจาก API
//   currentDate: string = new Date().toLocaleDateString(); // แสดงแค่วันที่
//   currentTime: string = new Date().toLocaleTimeString(); // แสดงแค่เวลา (เช่น '12:30:00 PM')
//   username: string = 'John Doe'; // ชื่อผู้ใช้
//   shift: string = 'Morning';

//   constructor(private fb: FormBuilder, private QaformService: QaformService) {
//     this.form = this.fb.group({
//       status: ['', Validators.required]
//     });
//   }

//   ngOnInit() {
//     this.loadDataFromAPI(); // เรียกใช้ API เพื่อดึงข้อมูล
//   }

//   loadDataFromAPI() {
//     this.QaformService.getSteps().subscribe(
//       (data) => {
//         this.steps = data;  // รับข้อมูลทั้งหมดตามลำดับที่เรียง
//       },
//       (error) => {
//         console.error('Error loading data', error);
//       }
//     );
//   }

//   nextStep() {
//     if (this.form?.valid) {
//       const currentItem = this.steps[this.currentStep];
//       currentItem.status = this.form.value.status;
  
//       // ตรวจสอบว่าเราอยู่ในขั้นตอนสุดท้ายหรือไม่
//       if (this.currentStep < this.steps.length - 1) {
//         this.currentStep++;
//       } else {
//         // เมื่อถึงขั้นตอนสุดท้ายแล้ว ไปที่หน้า "ยืนยันข้อมูลทั้งหมด"
//         this.currentStep = this.steps.length;
//       }
//     }
//   }  

//   prevStep() {
//     this.currentStep--;
//   }

//   onSubmit() {
//     if (this.form?.valid) {
//       this.form?.markAllAsTouched();
//     }
//   }

//   get currentStepData() {
//     return this.steps[this.currentStep];
//   }
// }
