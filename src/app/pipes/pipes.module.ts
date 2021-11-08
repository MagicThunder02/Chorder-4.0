import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicNotationPipe } from './music-notation.pipe';
import { IntervalPipe } from './interval.pipe';
import { AccidentPipe } from './accident';

@NgModule({
  declarations: [MusicNotationPipe, IntervalPipe, AccidentPipe],
  imports: [
    CommonModule
  ],
  exports: [
    MusicNotationPipe,
    IntervalPipe,
    AccidentPipe
  ]
})
export class PipesModule { }
