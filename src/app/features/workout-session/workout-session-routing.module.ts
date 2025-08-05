import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionRunnerComponent } from './pages/session-runner/session-runner.component';

const routes: Routes = [
  { 
    path: ':workoutId',
    component: SessionRunnerComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkoutSessionRoutingModule {}
