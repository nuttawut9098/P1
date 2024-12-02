import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginauthService } from '../shared/service/loginauth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  // ตัวอย่างข้อมูลผู้ใช้ที่กำหนดเอง
  users = [
    { username: 'admin323', password: '123456', role: 'admin' },
    { username: 'user323', password: '123456', role: 'user' }
  ];

  constructor(private authService: LoginauthService, private router: Router) {}

  onSubmit() {
    const user = this.users.find(u => u.username === this.username && u.password === this.password);
    
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      if (user.role === 'admin') {
        this.router.navigate(['/admin']);
      } else if (user.role === 'user') {
        this.router.navigate(['/user']);
      }
    } else {
      alert('Invalid username or password!');
    }
  }
}
