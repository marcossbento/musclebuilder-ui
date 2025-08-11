import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkoutSessionRoutingModule } from './workout-session-routing.module';
import { WorkoutSessionComponent } from './workout-session.component';
import { SessionRunnerComponent } from './pages/session-runner/session-runner.component';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from "primeng/toast";
import { SessionSummaryComponent } from './pages/session-summary/session-summary.component';
import { DividerModule } from 'primeng/divider'
import { ScrollPanelModule } from 'primeng/scrollpanel'

@NgModule({
  declarations: [
    WorkoutSessionComponent,
    SessionRunnerComponent,
    SessionSummaryComponent
  ],
  imports: [
    CommonModule,
    WorkoutSessionRoutingModule,
    ReactiveFormsModule,
    ButtonModule,
    ProgressSpinnerModule,
    TagModule,
    CardModule,
    InputNumberModule,
    ToastModule,
    DividerModule,
    ScrollPanelModule
]
})
export class WorkoutSessionModule { }
