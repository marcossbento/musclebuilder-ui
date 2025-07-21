import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExerciseDTO } from '../models/exercise.model';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private http = inject(HttpClient);
  private readonly API_URL = '/api/exercises';

  constructor() { }

  getAllExercises(): Observable<ExerciseDTO[]> {
    return this.http.get<ExerciseDTO[]>(this.API_URL);    
  }
}
