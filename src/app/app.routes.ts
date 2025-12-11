import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('../component/home/home').then(m => m.Home),
  },
  {
    path: 'more',
    pathMatch: 'full',
    loadComponent: () => import('../component/more-services/more-services').then(m => m.MoreServices),
  },
  {
    path: 'login',
    pathMatch: 'full',
    loadComponent: () => import('../component/login/login').then(m => m.Login),
  },
  {
    path: 'service',
    pathMatch: 'full',
    loadComponent: () => import('../component/servis-onefor-one/servis-onefor-one').then(m => m.ServisOneforOne),
  },
   {
    path: 'dashboard',
    pathMatch: 'full',
    loadComponent: () => import('../component/inicioadmin/inicioadmin').then(m => m.Inicioadmin),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
