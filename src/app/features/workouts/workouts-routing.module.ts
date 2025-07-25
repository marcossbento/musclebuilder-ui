import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkoutsComponent } from './workouts.component';
import { WorkoutBuilderComponent } from './pages/workout-builder/workout-builder.component';
import { WorkoutListComponent } from './pages/workout-list/workout-list.component';

const routes: Routes = [
  {
     path: '', 
     component: WorkoutListComponent 
  },
  {
    path: 'new',
    component: WorkoutBuilderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkoutsRoutingModule { }
