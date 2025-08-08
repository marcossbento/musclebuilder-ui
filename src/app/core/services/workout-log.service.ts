import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { StartWorkoutRequest, WorkoutLogResponse } from '../models/workout-log.model';
import { Observable } from 'rxjs';
import { LogExerciseRequest } from '../models/workout.model';

@Injectable({
  providedIn: 'root'
})
export class WorkoutLogService {
  private http = inject(HttpClient);
  private readonly API_URL = "/api/workout-logs";

  startWorkout(request: StartWorkoutRequest): Observable<WorkoutLogResponse> {
    return this.http.post<WorkoutLogResponse>(`${this.API_URL}/start`, request);
  }

  getWorkoutLogById(logId: number): Observable<WorkoutLogResponse> {
    return this.http.get<WorkoutLogResponse>(`${this.API_URL}/${logId}`);
  }

  logExercise(logId: number, request: LogExerciseRequest): Observable<WorkoutLogResponse> {
    return this.http.post<WorkoutLogResponse>(`${this.API_URL}/${logId}/exercises`, request);
  }

  completeWorkout(logId: number): Observable<WorkoutLogResponse> {
    return this.http.post<WorkoutLogResponse>(`${this.API_URL}/${logId}/complete`, {});
  }

  constructor() { }
}
