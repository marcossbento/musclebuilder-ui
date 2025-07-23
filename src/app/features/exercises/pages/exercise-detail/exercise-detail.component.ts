import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExerciseService } from '../../../../core/services/exercise.service';
import { ExerciseDTO } from '../../../../core/models/exercise.model';

@Component({
  selector: 'app-exercise-detail',
  templateUrl: './exercise-detail.component.html',
  styleUrl: './exercise-detail.component.scss'
})
export class ExerciseDetailComponent implements OnInit{
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private exerciseService = inject(ExerciseService);

  exercise: ExerciseDTO | null = null;
  isLoading = true;

  ngOnInit(): void {
      const exerciseId = this.route.snapshot.paramMap.get('id');

      if (exerciseId) {
        this.exerciseService.getExerciseById(+exerciseId).subscribe({
          next: (data) => {
            this.exercise = data;
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Exercício não encontrado', err);
            this.isLoading = false;
            this.router.navigate(['/exercises']);
          }
        })
      }
  }
}
