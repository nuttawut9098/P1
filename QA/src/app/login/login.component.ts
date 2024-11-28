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

  constructor(private authService: LoginauthService, private router: Router) {}

  onSubmit() {
    this.authService.authenticateUser(this.username, this.password).subscribe(
      (user) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        if (user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (user.role === 'user') {
          this.router.navigate(['/user']);
        }
      },
      (error) => {
        alert('Invalid username or password!');
        console.error('Error during login:', error);
      }
    );
  }
}
