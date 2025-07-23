import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkoutsComponent } from './workouts.component';
import { WorkoutBuilderComponent } from './pages/workout-builder/workout-builder.component';

const routes: Routes = [
  {
     path: '', 
     component: WorkoutsComponent 
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
