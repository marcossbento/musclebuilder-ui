import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExerciseListComponent } from './pages/exercise-list/exercise-list.component';
import { ExerciseDetailComponent } from './pages/exercise-detail/exercise-detail.component';

const routes: Routes = [
  { 
    path: '',
    component: ExerciseListComponent 
  },
  {
    path: ':id',
    component: ExerciseDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExercisesRoutingModule { }
