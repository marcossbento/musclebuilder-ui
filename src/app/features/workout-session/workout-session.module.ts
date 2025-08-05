import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkoutSessionRoutingModule } from './workout-session-routing.module';
import { WorkoutSessionComponent } from './workout-session.component';
import { SessionRunnerComponent } from './pages/session-runner/session-runner.component';


@NgModule({
  declarations: [
    WorkoutSessionComponent,
    SessionRunnerComponent
  ],
  imports: [
    CommonModule,
    WorkoutSessionRoutingModule
  ]
})
export class WorkoutSessionModule { }
