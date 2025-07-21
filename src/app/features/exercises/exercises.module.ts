import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExercisesRoutingModule } from './exercises-routing.module';
import { ExercisesComponent } from './exercises.component';
import { ExerciseListComponent } from './pages/exercise-list/exercise-list.component';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';



@NgModule({
  declarations: [
    ExerciseListComponent
  ],
  imports: [
    CommonModule,
    ExercisesRoutingModule,
    DataViewModule,
    TagModule,
    ProgressSpinnerModule,
    ButtonModule
  ]
})
export class ExercisesModule { }
