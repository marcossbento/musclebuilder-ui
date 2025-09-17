import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { WorkoutDTO } from '../models/workout.model';

// --- INTERFACES FRONT ---
export interface GamifiedDashboardStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  completedWorkouts: number;
  totalVolume: number;
  streak: number;
  achievements: number;
}

export interface WeeklyMission {
  title: string;
  progress: number;
  goal: number;
}

// --- Interfaces que representam a RESPOSTA DA API ---
interface ApiUserLevel {
  level: number;
  currentXp: number;
  xpForNextLevel: number;
}

interface ApiStats {
  totalWorkouts: number;
  totalVolume: number;
  streak: number;
}

interface ApiWeeklyMission {
  description: string;
  xpReward: number;
  goal: number;
  currentProgress: number;
}

// Interface principal da resposta da API
export interface DashboardApiResponse {
  userLevel: ApiUserLevel;
  stats: ApiStats;
  activeMissions: ApiWeeklyMission[];
  recommendedWorkout: WorkoutDTO;
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
    return this.http.get<DashboardApiResponse>(`${this.API_URL}`).pipe(
      tap(data => {
        const frontendStats: GamifiedDashboardStats = {
          level: data.userLevel.level,
          xp: data.userLevel.currentXp,
          xpToNextLevel: data.userLevel.xpForNextLevel,
          completedWorkouts: data.stats.totalWorkouts,
          totalVolume: data.stats.totalVolume,
          streak: data.stats.streak,
          achievements: 0
        };

        let frontendMission: WeeklyMission | null = null;

        if (data.activeMissions && data.activeMissions.length > 0) {
          const firstMissionFromApi = data.activeMissions[0];

          frontendMission = {
            title: firstMissionFromApi.description,
            progress: firstMissionFromApi.currentProgress,
            goal: firstMissionFromApi.goal
          };
        }

        const recommendedWorkoutFromAPi = data.recommendedWorkout;
        let workoutForFrontend: WorkoutDTO | null = null;

        if (recommendedWorkoutFromAPi) {
          workoutForFrontend = {
            ...recommendedWorkoutFromAPi,
            id: recommendedWorkoutFromAPi.workoutId || 0
          };
        }

        this.dashboardStatsSubject.next(frontendStats);
        this.nextWorkoutSubject.next(workoutForFrontend);
        this.weeklyMissionSubject.next(frontendMission);
      })
    );
  }
}
