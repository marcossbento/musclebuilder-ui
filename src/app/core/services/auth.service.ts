import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginRequest } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  private readonly API_URL = '/api';

  constructor() { }

  login(credentials: LoginRequest): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/login`, credentials);  
  }
}
