
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DataTableItem {
  portion: string;
  no: number;
  items: string;
  item_remind: string;
  rank: string;
  qa_network: string;
  sub_seq: string;
  item_seq: string;
  item_type: string;
  item_detail: string;
  status?: string|null;
  shift?: string;
  date?: Date|string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // ดึงข้อมูลทั้งหมดจาก datatable
  getAllItems(): Observable<DataTableItem[]> {
    return this.http.get<DataTableItem[]>(`${this.apiUrl}/datatable`);
  }

  // เพิ่มข้อมูลใหม่ใน datatable
  addItem(item: DataTableItem): Observable<DataTableItem> {
    return this.http.post<DataTableItem>(`${this.apiUrl}/datatable`, item);
  }
  // ฟังก์ชันเพื่อดึงข้อมูล
  getItem(subSeq: string, itemSeq: string): Observable<DataTableItem> {
    return this.http.get<DataTableItem>(`${this.apiUrl}/datatable/${subSeq}/${itemSeq}`);
  }

  // ฟังก์ชันเพื่ออัปเดตข้อมูล
  updateItem(item: DataTableItem): Observable<DataTableItem> {
    return this.http.put<DataTableItem>(`${this.apiUrl}/datatable/${item.sub_seq}/${item.item_seq}`, item);
  }
  deleteItem(subSeq: string, itemSeq: string): Observable<any> {
    const url = `http://localhost:3000/datatable/${subSeq}/${itemSeq}`;  // Remove "master/"
    return this.http.delete(url);
  }
  // Method สำหรับดึงข้อมูล
  getData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/employees`);  // เปลี่ยน path เป็น /employees
  }
  getDataByShift(shift: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${shift}`);
  }

}
