import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginRequest } from '../models/user.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = '/api';
  private readonly AUTH_KEY = 'musclebuilder_auth';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.checkInitialAuthState();
  }

  private checkInitialAuthState(): void {
    const isAuthenticated = localStorage.getItem(this.AUTH_KEY) ==='true';
    this.isAuthenticatedSubject.next(isAuthenticated)
  }

  public getIsAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  login(credentials: LoginRequest): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/login`, credentials).pipe(
      tap(() => {
        localStorage.setItem(this.AUTH_KEY, 'true');
        
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);

    this.isAuthenticatedSubject.next(false)

    this.router.navigate(['/auth']);
  }
}
