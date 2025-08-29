import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { WeeklyMission } from '../../../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard-mission',
  templateUrl: './dashboard-mission.component.html',
  styleUrl: './dashboard-mission.component.scss'
})
export class DashboardMissionComponent implements OnChanges {
  @Input() mission: WeeklyMission | null = null;

  missionProgressPercentage: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
      if (changes['mission'] && this.mission) {
        const progress = Math.min(this.mission.progress, this.mission.goal);
        this.missionProgressPercentage = (progress / this.mission.goal) * 100;
      }
  }
}
