import { Component, inject, OnInit } from '@angular/core';
import { ExerciseService } from '../../../../core/services/exercise.service';
import { ExerciseDTO } from '../../../../core/models/exercise.model';

@Component({
  selector: 'app-exercise-list',
  templateUrl: './exercise-list.component.html',
  styleUrl: './exercise-list.component.scss'
})
export class ExerciseListComponent implements OnInit {
  private exerciseService = inject(ExerciseService);

  exercises: ExerciseDTO[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.exerciseService.getAllExercises().subscribe({
      next: (data) => {
        this.exercises = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar exercícios', err);
        this.isLoading = false;
      }
    })
  }

  getSeverity(difficultyLevel: string): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" {
    const severityMap: { [key: string]: "success" | "secondary" | "info" | "warning" | "danger" | "contrast" } = {
      'Iniciante': 'success',
      'Intermediário': 'warning', 
      'Avançado': 'danger',
      'Beginner': 'success',
      'Intermediate': 'warning',
      'Advanced': 'danger',
      'Fácil': 'success',
      'Médio': 'warning',
      'Difícil': 'danger'
    };

    return severityMap[difficultyLevel] || 'secondary';
  }
}
