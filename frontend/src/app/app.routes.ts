import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth.page').then((m) => m.AuthPage)
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./pages/onboarding.page').then((m) => m.OnboardingPage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard.page').then((m) => m.DashboardPage)
  },
  {
    path: 'menu',
    loadComponent: () => import('./pages/menu.page').then((m) => m.MenuPage)
  },
  { path: '', pathMatch: 'full', redirectTo: 'auth' },
  { path: '**', redirectTo: 'auth' }
];
