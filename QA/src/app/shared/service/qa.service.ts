  import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getResetTime() {
    return this.http.get(`${this.apiUrl}/get-reset-time`);
  }

  setResetTime(hour: number, minute: number) {
    return this.http.post(`${this.apiUrl}/set-reset-time`, { hour, minute });
  }
}