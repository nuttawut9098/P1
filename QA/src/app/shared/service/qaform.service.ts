import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class QaformService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  updateItemStatus(item: any): Observable<any> {
    const url = `${this.apiUrl}/datatable/${item.subSeq}/${item.itemSeq}`;
    return this.http.put(url, { status: item.status });
  }

  saveChanges(changes: { subSeq: number; itemSeq: number; status: string; path?: string; remark?: string }[]): Observable<any> {
    const url = `${this.apiUrl}/datatable/status`;
    return this.http.put(url, changes);
  }   

  getCurrentShift(): Observable<any> {
    const url = `${this.apiUrl}/datatable/shift`;
    return this.http.get<any>(url);
  }

  updateStatusWithFile(formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/datatable/status`, formData);  // ตรวจสอบ URL ให้ถูกต้อง
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
    const url = `${this.apiUrl}/datatable/status`;
    return this.http.put(url, payload);
  }
  updateStatus(subSeq: number, itemSeq: number, status: string): Observable<any> {
    const url = `${this.apiUrl}/datatable/status/${subSeq}/${itemSeq}`;
    const body = { status };
    return this.http.put<any>(url, body);
  }
}
