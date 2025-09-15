import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkoutCreateDTO, WorkoutDTO } from '../models/workout.model';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private http = inject(HttpClient);
  private readonly API_URL = '/api/workouts'

  getUserWorkouts(): Observable<WorkoutDTO[]> {
    return this.http.get<WorkoutDTO[]>(this.API_URL);
  }

  getWorkoutById(id: number): Observable<WorkoutDTO> {
    return this.http.get<WorkoutDTO>(`${this.API_URL}/${id}`);
  }

  getRecommendedWorkout(): Observable<WorkoutDTO | null> {
    return this.http.get<WorkoutDTO | null>(`${this.API_URL}/recommended`)
  }

  createWorkout(workoutData: WorkoutCreateDTO): Observable<WorkoutDTO> {
    return this.http.post<WorkoutDTO>(this.API_URL, workoutData);
  }

  constructor() { }
}
