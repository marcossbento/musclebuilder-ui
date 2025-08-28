import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { WorkoutDTO } from '../models/workout.model';
import { User } from '../models/user.model';

export interface GamifiedDashboardStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  completedWorkouts: number;
  totalWeightLifted: number;
  streak: number;
  achievements: number;
}

export interface WeeklyMission {
  title: string;
  progress: number;
  goal: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private readonly API_URL = '/api/dashboard';

  private dashboardStatsSubject = new BehaviorSubject<GamifiedDashboardStats | null>(null);
  public dashboardStats$ = this.dashboardStatsSubject.asObservable();

  private nextWorkoutSubject = new BehaviorSubject<WorkoutDTO | null>(null);
  public nextWorkout$ = this.nextWorkoutSubject.asObservable();

  private weeklyMissionSubject = new BehaviorSubject<WeeklyMission | null>(null);
  public weeklyMission$ = this.weeklyMissionSubject.asObservable();

  constructor() { }

  public loadDashboardData(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}`).pipe(
      tap(data => {
        this.dashboardStatsSubject.next(data.stats);
        this.nextWorkoutSubject.next(data.nextWorkout);
        this.weeklyMissionSubject.next(data.weeklyMission);
      })
    );
  }
}
