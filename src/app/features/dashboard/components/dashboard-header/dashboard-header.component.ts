import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { User } from '../../../../core/models/user.model';
import { GamifiedDashboardStats } from '../../../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.scss'
})
export class DashboardHeaderComponent implements OnChanges {
  @Input() user: User | null = null;
  @Input() stats: GamifiedDashboardStats | null = null;

  xpPercentage: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
      if (changes['stats'] && this.stats) {
        setTimeout(() => {
          this.xpPercentage = (this.stats!.xp / this.stats!.xpToNextLevel) * 100;
        }, 100);
      }
  }
}
