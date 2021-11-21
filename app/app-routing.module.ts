import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoggedGuard } from './guards/logged.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule), canActivate: [AuthGuard]
  },
  {
    path: 'lista',
    loadChildren: () => import('./pages/lista/lista.module').then( m => m.ListaPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule), canActivate: [LoggedGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule),// canActivate: [LoggedGuard]
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./pages/perfil/edit/edit.module').then( m => m.EditPageModule), canActivate: [AuthGuard]
  },
/*   {
    path: 'historic',
    loadChildren: () => import('./pages/historic/historic.module').then( m => m.HistoricPageModule)
  }, */
 /* {
    path: '',
    loadChildren: () => import('./pages/index/index.module').then( m => m.IndexPageModule), canActivate: [AuthGuard]
  } */
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
