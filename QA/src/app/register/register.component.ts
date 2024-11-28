import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: false
})
export class RegisterComponent {
  username: string = "";
  password: string = "";
  role: string = "user"; // ตั้งค่า default role

  constructor(private router: Router) {}

  onSubmit() {
    // ดึงข้อมูลผู้ใช้ที่มีอยู่จาก localStorage
    const storedUsers = localStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    // ตรวจสอบว่าชื่อผู้ใช้นั้นมีอยู่แล้วหรือไม่
    const existingUser = users.find((user: any) => user.username === this.username);
    if (existingUser) {
      alert('Username already exists!');
      return;
    }

    // เพิ่มผู้ใช้ใหม่
    const newUser = { username: this.username, password: this.password, role: this.role };
    users.push(newUser);

    // เก็บข้อมูลผู้ใช้กลับไปยัง localStorage
    localStorage.setItem('users', JSON.stringify(users));

    // นำทางไปยังหน้า Login หรือหน้าอื่นๆ
    this.router.navigate(['/login']);
  }
}
