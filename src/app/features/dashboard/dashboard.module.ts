import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardMainComponent } from './pages/dashboard-main/dashboard-main.component';
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { SharedModule } from '../../shared/shared.module';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';
import { DashboardStatsComponent } from './components/dashboard-stats/dashboard-stats.component';
import { DashboardMissionComponent } from './components/dashboard-mission/dashboard-mission.component';
import { DashboardNextWorkoutComponent } from './components/dashboard-next-workout/dashboard-next-workout.component';
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { MenuModule } from 'primeng/menu';


@NgModule({
  declarations: [
    DashboardMainComponent,
    DashboardHeaderComponent,
    DashboardStatsComponent,
    DashboardMissionComponent,
    DashboardNextWorkoutComponent,
    UserMenuComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ButtonModule,
    DividerModule,
    SharedModule,
    ProgressSpinnerModule,
    MenuModule
]
})
export class DashboardModule { }
