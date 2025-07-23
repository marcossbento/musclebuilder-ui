import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExercisesRoutingModule } from './exercises-routing.module';
import { ExercisesComponent } from './exercises.component';
import { ExerciseListComponent } from './pages/exercise-list/exercise-list.component';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { ExerciseDetailComponent } from './pages/exercise-detail/exercise-detail.component';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';



@NgModule({
  declarations: [
    ExerciseListComponent,
    ExerciseDetailComponent
  ],
  imports: [
    CommonModule,
    ExercisesRoutingModule,
    DataViewModule,
    TagModule,
    ProgressSpinnerModule,
    ButtonModule,
    CardModule,
    FormsModule,
    InputTextModule,
    DropdownModule
  ]
})
export class ExercisesModule { }
