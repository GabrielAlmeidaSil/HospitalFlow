import { Routes } from '@angular/router';
import { Login } from './features/auth/pages/login/login';
import { Dashboard } from './features/dashboard/pages/dashboard/dashboard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard]
    }
];
