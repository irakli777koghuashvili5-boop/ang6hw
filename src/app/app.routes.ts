import { Routes } from '@angular/router';
import { guardGuard } from './guard/guard-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home').then((m) => m.Home),
  },
  {
    path: 'products',
    loadComponent: () => import('./products/products').then((m) => m.Products),
  },
  {
    path: `details`,
    loadComponent: () => import('./details/details').then((m) => m.Details),
  },
  {
    path: `sign-in`,
    loadComponent: () => import('./sign-in/sign-in').then((m) => m.SignIn),
  },
  {
    path: `sign-up`,
    loadComponent: () => import('./sign-up/sign-up').then((m) => m.SignUp),
  },
  {
    path: `recover-passcode`,
    loadComponent: () => import('./recover-passcode/recover-passcode').then((m) => m.RecoverPasscode),
  },
  {
    path: `profile`,
    loadComponent: () => import('./profile/profile').then((m) => m.Profile),
    canActivate: [guardGuard],
  },
  {
    path: `qrcode`,
    loadComponent: () => import('./qrcode/qrcode').then((m) => m.Qrcode),
  },
  {
    path: '**',
    loadComponent: () => import('./error/error').then((m) => m.Error),
  },
];