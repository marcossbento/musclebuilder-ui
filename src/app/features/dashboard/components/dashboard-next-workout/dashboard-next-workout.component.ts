import { Component, Input } from '@angular/core';
import { WorkoutDTO } from '../../../../core/models/workout.model';

@Component({
  selector: 'app-dashboard-next-workout',
  templateUrl: './dashboard-next-workout.component.html',
  styleUrl: './dashboard-next-workout.component.scss'
})
export class DashboardNextWorkoutComponent {
  @Input() workout: WorkoutDTO | null = null;
}
