import { Routes } from '@angular/router';
import { Login } from './features/auth/pages/login/login';
import { Dashboard } from './features/dashboard/pages/dashboard/dashboard';
import { authGuard } from './core/guards/auth.guard';
import { MainLayout } from './layout/main-layout/main-layout';
import { Pacientes } from './features/pacientes/pages/pacientes/pacientes';
import { Leitos } from './features/leitos/pages/leitos/leitos';
import { Ocorrencias } from './features/ocorrencias/pages/ocorrencias/ocorrencias';
import { Relatorios } from './features/relatorios/pages/relatorios/relatorios';

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
        path: '',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', component: Dashboard },
            { path: 'pacientes', component: Pacientes },
            { path: 'leitos', component: Leitos },
            { path: 'ocorrencias', component: Ocorrencias },
            { path: 'relatorios', component: Relatorios },
        ]
    }
];
