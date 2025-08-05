import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { StartWorkoutRequest, WorkoutLogResponse } from '../models/workout-log.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkoutLogService {
  private http = inject(HttpClient);
  private readonly API_URL = "/api/workout-logs";

  startWorkout(request: StartWorkoutRequest): Observable<WorkoutLogResponse> {
    return this.http.post<WorkoutLogResponse>(`${this.API_URL}/start`, request);
  }

  // TODO: métodos para registrar exercícios e completar treino

  constructor() { }
}
