import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QaformService {
  private apiUrl = 'http://localhost:3000/datatable';

  constructor(private http: HttpClient) {}

  getData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  updateItemStatus(item: any): Observable<any> {
    const url = `${this.apiUrl}/${item.subSeq}/${item.itemSeq}`;
    return this.http.put(url, { status: item.status });
  }

  saveChanges(changes: { subSeq: number; itemSeq: number; status: string; path?: string; remark?: string }[]): Observable<any> {
    const url = `${this.apiUrl}/status`;
    return this.http.put(url, changes);
  }

  getCurrentShift(): Observable<any> {
    const url = `${this.apiUrl}/shift`;
    return this.http.get<any>(url);
  }

  updateStatusWithFile(formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/status`, formData);  // ตรวจสอบ URL ให้ถูกต้อง
  }

  // ฟังก์ชันอื่น ๆ สำหรับการอัปเดตสถานะ
  saveChangesWithShiftAndDate(payload: { 
    changes: { 
      subSeq: number; 
      itemSeq: number; 
      status: string; 
      remark?: string;
      path?: string; 
    }[], 
    shift: string, 
    date: string 
  }): Observable<any> {
    const url = `${this.apiUrl}/status`;
    return this.http.put(url, payload);
  }
  updateStatus(subSeq: number, itemSeq: number, status: string): Observable<any> {
    const url = `${this.apiUrl}/status/${subSeq}/${itemSeq}`;
    const body = { status };
    return this.http.put<any>(url, body);
  }
}
