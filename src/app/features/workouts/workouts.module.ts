import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkoutsRoutingModule } from './workouts-routing.module';
import { WorkoutListComponent } from './pages/workout-list/workout-list.component';
import { WorkoutBuilderComponent } from './pages/workout-builder/workout-builder.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@NgModule({
  declarations: [
    WorkoutListComponent,
    WorkoutBuilderComponent
  ],
  imports: [
    CommonModule,
    WorkoutsRoutingModule,
    ButtonModule,
    CardModule,
    ProgressSpinnerModule
  ]
})
export class WorkoutsModule { }
