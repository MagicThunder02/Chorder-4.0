import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsPage } from './tabs.page';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,

    children: [
      {
        path: '',
        redirectTo: 'chordmaker',
        pathMatch: 'full'
      },
      {
        path: 'chordmaker',
        loadChildren: () => import('./chordmaker/chordmaker.module').then(m => m.ChordmakerPageModule)
      },
      {
        path: 'notefinder',
        loadChildren: () => import('./notefinder/notefinder.module').then(m => m.NotefinderPageModule)
      },
      {
        path: 'metronome',
        loadChildren: () => import('./metronome/metronome.module').then(m => m.MetronomePageModule)
      }
    ]
  },
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabsPage]
})
export class TabsPageModule { }
