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

  private allExercises: ExerciseDTO[] = [];
  isLoading = true;

  searchTerm: string = '';
  selectedMuscleGroup: string | null = null;
  selectedDifficulty: string | null = null;

  muscleGroupOptions: string[] = [];
  difficultyOptions = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

  ngOnInit(): void {
    this.exerciseService.getAllExercises().subscribe({
      next: (data) => {
        this.allExercises = data;
        this.isLoading = false;
        this.muscleGroupOptions = [...new Set(data.map(e => e.muscleGroup))];
      },
      error: (err) => {
        console.error('Erro ao buscar exercícios', err);
        this.isLoading = false;
      }
    })
  }

  get filteredExercises(): ExerciseDTO[] {
    return this.allExercises.filter(exercise =>{
      const searchMatch = exercise.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const muscleGroupMatch = this.selectedMuscleGroup ? exercise.muscleGroup === this.selectedMuscleGroup : true;
      const difficultyMatch = this.selectedDifficulty ? exercise.difficultyLevel === this.selectedDifficulty: true;

      return searchMatch && muscleGroupMatch && difficultyMatch;
    });
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
