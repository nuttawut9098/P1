  import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class QaService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getResetTime() {
    return this.http.get(`${this.apiUrl}/get-reset-time`);
  }

  setResetTime(hour: number, minute: number) {
    return this.http.post(`${this.apiUrl}/set-reset-time`, { hour, minute });
  }
}