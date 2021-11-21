import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexPage } from './index.page';

const routes: Routes = [
  {
    path: 'index',
    component: IndexPage,
    children: [
      {
        path: 'perfil',
        loadChildren: () => import('../perfil/perfil.module').then( m => m.PerfilPageModule)
      },
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then( m => m.HomePageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: '/index'
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndexPageRoutingModule {}
