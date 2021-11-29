import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChordComponent } from 'src/app/components/chord/chord.component';
import { ActionButtonsComponent } from './action-buttons/action-buttons.component';
import { PipesModule } from '../pipes/pipes.module';
import { SwiperModule } from 'swiper/angular';
import { AccidentPipe } from '../pipes/accident';
import { ExplainButtonsComponent } from './explain-buttons/explain-buttons.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SwiperModule,
    TranslateModule,
    PipesModule
  ],
  declarations: [ChordComponent, ActionButtonsComponent, ExplainButtonsComponent],
  exports: [ChordComponent, ActionButtonsComponent, ExplainButtonsComponent],
  providers: [AccidentPipe]
})
export class ComponentsModule { }
