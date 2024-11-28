import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface User {
  username: string;
  password: string;
  role: string;
}

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    standalone: false
})
export class FormComponent implements OnInit {
  user: User = { username: '', password: '', role: '' };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // รับค่าจาก URL
    const usernameToLoad = this.route.snapshot.paramMap.get('username'); // แก้ไขตามพารามิเตอร์ที่คุณกำหนดใน routing
    if (usernameToLoad) {
      this.loadUserData(usernameToLoad); // เรียกใช้ฟังก์ชันโหลดข้อมูลผู้ใช้
    }
  }

  loadUserData(username: string): void {
    const storedUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]'); // โหลดข้อมูลจาก localStorage
    const user = storedUsers.find((u: User) => u.username === username); 

    if (user) {
      this.user = user; // กำหนดค่า user จากข้อมูลที่โหลด
    } else {
      console.error(`User with username ${username} not found.`);
    }
  }

  updateUser(): void {
    if (this.user.username) {
        const updatedUser: User = {
            username: this.user.username,
            role: this.user.role,
            password: this.user.password,
        };

        const storedUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');
        const index = storedUsers.findIndex((u: User) => u.username === this.user.username);
        
        if (index !== -1) {
            storedUsers[index] = updatedUser;
            localStorage.setItem('users', JSON.stringify(storedUsers));
            console.log('User data saved:', updatedUser);
        }
    } else {
        console.log('Invalid form');
    }
}

}
