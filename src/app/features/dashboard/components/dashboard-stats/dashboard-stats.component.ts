import { Component, Input } from '@angular/core';
import { GamifiedDashboardStats } from '../../../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard-stats',
  templateUrl: './dashboard-stats.component.html',
  styleUrl: './dashboard-stats.component.scss'
})
export class DashboardStatsComponent {
  @Input() stats: GamifiedDashboardStats | null = null;
}
