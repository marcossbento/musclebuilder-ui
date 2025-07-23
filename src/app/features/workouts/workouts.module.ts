import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkoutsRoutingModule } from './workouts-routing.module';
import { WorkoutsComponent } from './workouts.component';
import { WorkoutListComponent } from './pages/workout-list/workout-list.component';
import { WorkoutBuilderComponent } from './pages/workout-builder/workout-builder.component';


@NgModule({
  declarations: [
    WorkoutsComponent,
    WorkoutListComponent,
    WorkoutBuilderComponent
  ],
  imports: [
    CommonModule,
    WorkoutsRoutingModule
  ]
})
export class WorkoutsModule { }
