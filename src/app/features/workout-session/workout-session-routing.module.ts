import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkoutSessionComponent } from './workout-session.component';

const routes: Routes = [{ path: '', component: WorkoutSessionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkoutSessionRoutingModule { }
