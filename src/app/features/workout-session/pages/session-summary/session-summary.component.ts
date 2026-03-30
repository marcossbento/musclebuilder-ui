import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutLogService } from '../../../../core/services/workout-log.service';
import { WorkoutLogResponse } from '../../../../core/models/workout-log.model';
import { Achievement } from '../../../../core/models/achievements.model';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-session-summary',
  templateUrl: './session-summary.component.html',
  styleUrl: './session-summary.component.scss'
})
export class SessionSummaryComponent implements OnInit{
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private workoutLogService = inject(WorkoutLogService);

  isLoading = true;
  workoutLog?: WorkoutLogResponse;
  
  newlyAwardedAchievements: Achievement[] = [];
  showPRModal = false;

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['newlyAwardedAchievements']) {
      this.newlyAwardedAchievements = navigation.extras.state['newlyAwardedAchievements'];
    }
  }

  ngOnInit(): void {
      if (this.newlyAwardedAchievements.some(a => a.name === 'Recordista Pessoal' || a.name.includes('Recorde'))) {
        this.showPRModal = true;
      }

      this.route.paramMap.pipe(
        switchMap(params => {
          const logId = Number(params.get('logId'));
          return this.workoutLogService.getWorkoutLogById(logId);
        })
      ).subscribe(log => {
        this.workoutLog = log;
        this.isLoading = false;
      });
  }

  closePRModal(): void {
    this.showPRModal = false;
  }
}
