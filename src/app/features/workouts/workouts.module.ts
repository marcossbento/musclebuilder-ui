import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkoutsRoutingModule } from './workouts-routing.module';
import { WorkoutListComponent } from './pages/workout-list/workout-list.component';
import { WorkoutBuilderComponent } from './pages/workout-builder/workout-builder.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog'
import { TableModule } from 'primeng/table'
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';


@NgModule({
  declarations: [
    WorkoutListComponent,
    WorkoutBuilderComponent
  ],
  imports: [
    CommonModule,
    WorkoutsRoutingModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    ProgressSpinnerModule,
    InputTextModule,
    InputNumberModule,
    ToastModule,
    DialogModule,
    TableModule
  ]
})
export class WorkoutsModule { }
