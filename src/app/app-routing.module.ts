import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loginGuard } from './core/guards/login.guard';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { 
    path: 'auth', 
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule), 
    canActivate: [loginGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [authGuard]
  },
  {
    path: 'exercises',
    loadChildren: () => import('./features/exercises/exercises.module').then(m => m.ExercisesModule),
    canActivate: [authGuard]
  },
  {
    path: 'workouts',
    loadChildren: () => import('./features/workouts/workouts.module').then(m => m.WorkoutsModule),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  { path: 'session', loadChildren: () => import('./features/workout-session/workout-session.module').then(m => m.WorkoutSessionModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
