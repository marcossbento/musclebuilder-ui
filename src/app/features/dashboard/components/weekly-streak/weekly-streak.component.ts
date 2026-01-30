import { Component, OnInit, inject } from '@angular/core';
import { WorkoutLogService } from '../../../../core/services/workout-log.service';
import { map } from 'rxjs';

interface WeekDay {
  date: Date;
  label: string;
  status: 'active' | 'missed' | 'future';
  isToday: boolean;
}

@Component({
  selector: 'app-weekly-streak',
  templateUrl: './weekly-streak.component.html',
  styleUrls: ['./weekly-streak.component.scss']
})
export class WeeklyStreakComponent implements OnInit {
  private workoutLogService = inject(WorkoutLogService);
  
  weekDays: WeekDay[] = [];
  loading = true;

  ngOnInit() {
    this.generateCurrentWeek();
    this.checkWorkoutHistory();
  }

  private generateCurrentWeek() {
    const today = new Date();

    const dayOfWeek = today.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const days = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];

    this.weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      
      const now = new Date();
      now.setHours(0,0,0,0);
      
      const isToday = this.getLocalDateString(date) === this.getLocalDateString(now);
      
      let status: 'active' | 'missed' | 'future' = 'future';

      if (date < now && !isToday) {
        status = 'missed';
      }

      return {
        date: date,
        label: days[i],
        status: status,
        isToday: isToday
      };
    });
  }

  private checkWorkoutHistory() {
    this.workoutLogService.getWorkoutHistory().subscribe({
      next: (logs) => {
        
        const workoutDates = new Set();
        
        logs.forEach(log => {
           try {
             const d = new Date(log.startedAt);
             const dateStr = this.getLocalDateString(d);
             workoutDates.add(dateStr);
           } catch (e) {
           }
        });

        this.weekDays = this.weekDays.map(day => {
          const dateStr = this.getLocalDateString(day.date);
          const hasWorkout = workoutDates.has(dateStr);
          
          let status = day.status;

          if (hasWorkout) {
            status = 'active';
          } 
          
          return { ...day, status: status };
        });
        
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      }
    });
  }
  private getLocalDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
