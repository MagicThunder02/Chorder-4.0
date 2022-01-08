import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { NotefinderPage } from './main/notefinder.page';
import { Routes, RouterModule } from '@angular/router';
import { SwiperModule } from 'swiper/angular';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { NotefinderInfoComponent } from './info/notefinder-info.component';
import { TranslateModule } from '@ngx-translate/core';

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
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NotefinderPage, NotefinderInfoComponent]

})
export class NotefinderPageModule { }
