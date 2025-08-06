import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkoutSessionRoutingModule } from './workout-session-routing.module';
import { WorkoutSessionComponent } from './workout-session.component';
import { SessionRunnerComponent } from './pages/session-runner/session-runner.component';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';


@NgModule({
  declarations: [
    WorkoutSessionComponent,
    SessionRunnerComponent
  ],
  imports: [
    CommonModule,
    WorkoutSessionRoutingModule,
    ButtonModule,
    ProgressSpinnerModule,
    TagModule,
    CardModule
  ]
})
export class WorkoutSessionModule { }
