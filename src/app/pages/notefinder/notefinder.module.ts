import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { NotefinderPage } from './notefinder.page';
import { Routes, RouterModule } from '@angular/router';
import { SwiperModule } from 'swiper/angular';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ActionButtonsComponent } from 'src/app/components/action-buttons/action-buttons.component';
import { ComponentsModule } from 'src/app/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: NotefinderPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    SwiperModule,
    ComponentsModule,
    RouterModule.forChild(routes)

  ],
  declarations: [NotefinderPage]

})
export class NotefinderPageModule { }
