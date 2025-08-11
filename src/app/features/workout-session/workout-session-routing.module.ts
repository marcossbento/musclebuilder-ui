import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionRunnerComponent } from './pages/session-runner/session-runner.component';
import { SessionSummaryComponent } from './pages/session-summary/session-summary.component';

const routes: Routes = [
  { 
    path: ':workoutId',
    component: SessionRunnerComponent 
  },
  {
    path: ':logId/summary',
    component: SessionSummaryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkoutSessionRoutingModule {}
