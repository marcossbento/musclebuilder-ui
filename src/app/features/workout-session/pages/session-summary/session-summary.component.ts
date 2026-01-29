import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkoutLogService } from '../../../../core/services/workout-log.service';
import { WorkoutLogResponse } from '../../../../core/models/workout-log.model';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-session-summary',
  templateUrl: './session-summary.component.html',
  styleUrl: './session-summary.component.scss'
})
export class SessionSummaryComponent implements OnInit{
  private route = inject(ActivatedRoute);
  private workoutLogService = inject(WorkoutLogService);

  isLoading = true;
  workoutLog?: WorkoutLogResponse;

  ngOnInit(): void {
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
}
