import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExerciseProgressDTO, ProgressSummaryDTO } from '../models/progress.model';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private http = inject(HttpClient);
  private readonly API_URL = '/api/progress';

  getProgressSummary(): Observable<ProgressSummaryDTO> {
    return this.http.get<ProgressSummaryDTO>(`${this.API_URL}/summary`);
  }

  getExerciseProgress(exerciseId: number): Observable<ExerciseProgressDTO[]> {
    return this.http.get<ExerciseProgressDTO[]>(`${this.API_URL}/exercises/${exerciseId}`);
  }
}
