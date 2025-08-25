import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Achievement } from '../models/achievements.model';

@Injectable({
  providedIn: 'root'
})
export class AchievementService {
  private http = inject(HttpClient);
  private readonly API_URL = '/api/achievements'

  getCurrentUserAchievements(): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(this.API_URL);
  }
}
