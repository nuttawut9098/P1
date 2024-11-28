import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginauthService {
  private apiUrl = 'http://localhost:3000/employees'; // URL ของ endpoint ที่ดึงข้อมูลพนักงาน
  
  constructor(private http: HttpClient) {}

  // Method สำหรับตรวจสอบข้อมูลผู้ใช้ (username และ password)
  authenticateUser(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password });
  }

  // Method สำหรับดึงข้อมูลผู้ใช้ทั้งหมด (ถ้าจำเป็น)
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
}
