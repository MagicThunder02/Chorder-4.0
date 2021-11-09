import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChordComponent } from 'src/app/components/chord/chord.component';
import { ActionButtonsComponent } from './action-buttons/action-buttons.component';
import { MusicNotationPipe } from '../pipes/music-notation.pipe';
import { PipesModule } from '../pipes/pipes.module';
import { SwiperModule } from 'swiper/angular';
import { AccidentPipe } from '../pipes/accident';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SwiperModule,
    PipesModule
  ],
  declarations: [ChordComponent, ActionButtonsComponent],
  exports: [ChordComponent, ActionButtonsComponent],
  providers: [AccidentPipe]
})
export class ComponentsModule { }
