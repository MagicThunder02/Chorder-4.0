import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChordmakerPage } from './main/chordmaker.page';
import { Routes, RouterModule } from '@angular/router';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ChordComponent } from 'src/app/components/chord/chord.component';
import { AccidentPipe } from 'src/app/pipes/accident';
import { SwiperModule } from 'swiper/angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { ChordmakerInfoComponent } from './info/chordmaker-info.component';
import { ExplainButtonsComponent } from 'src/app/components/explain-buttons/explain-buttons.component';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: ChordmakerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SwiperModule,
    PipesModule,
    ComponentsModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ChordmakerPage, ChordmakerInfoComponent],
  providers: [AccidentPipe]
})
export class ChordmakerPageModule { }
