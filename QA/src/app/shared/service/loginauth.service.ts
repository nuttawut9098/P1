import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LoginauthService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}

  // Method สำหรับตรวจสอบข้อมูลผู้ใช้ (username และ password)
  authenticateUser(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/employee/login`, { username, password });
  }

  // Method สำหรับดึงข้อมูลผู้ใช้ทั้งหมด (ถ้าจำเป็น)
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/employee`);
  }
}
