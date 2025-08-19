import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private readonly API_URL = 'api/users';

  getCurrentUserDetails(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/me`);
  }

}
