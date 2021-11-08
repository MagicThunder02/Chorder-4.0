import { Component, OnInit } from '@angular/core';
import { ChordType } from '@tonaljs/tonal';

@Component({
  selector: 'app-notefinder',
  templateUrl: './notefinder.page.html',
  styleUrls: ['./notefinder.page.scss'],
})
export class NotefinderPage implements OnInit {

  public buttons = [
    {
      name: 'random',
      icon: 'shuffle',
      action: () => this.randomizeTiles()
    },
    {
      name: 'delete',
      icon: 'trash',
      action: () => this.deleteTiles()
    },
    {
      name: 'translate',
      icon: 'language',
      action: () => this.translateTiles()
    },
    {
      name: 'info',
      icon: 'information',
      action: () => this.goToInfo()
    }
  ]

  public notes = [
    { name: 'Cb', class: 'tile-light' },
    { name: 'C', class: 'tile-light' },
    { name: 'C#', class: 'tile-light' },
    { name: 'Db', class: 'tile-light' },
    { name: 'D', class: 'tile-light' },
    { name: 'D#', class: 'tile-light' },
    { name: 'Eb', class: 'tile-light' },
    { name: 'E', class: 'tile-light' },
    { name: 'E#', class: 'tile-light' },
    { name: 'Fb', class: 'tile-light' },
    { name: 'F', class: 'tile-light' },
    { name: 'F#', class: 'tile-light' },
    { name: 'Gb', class: 'tile-light' },
    { name: 'G', class: 'tile-light' },
    { name: 'G#', class: 'tile-light' },
    { name: 'Ab', class: 'tile-light' },
    { name: 'A', class: 'tile-light' },
    { name: 'A#', class: 'tile-light' },
    { name: 'Bb', class: 'tile-light' },
    { name: 'B', class: 'tile-light' },
    { name: 'B#', class: 'tile-light' },
  ]

  public qualities = [
    { name: 'major', class: 'tile-light' },
    { name: 'minor', class: 'tile-light' },
    { name: 'augmented', class: 'tile-light' },
    { name: 'diminished', class: 'tile-light' },
  ]

  public numbers = [
    { name: '5', class: 'tile-light' },
    { name: '7', class: 'tile-light' },
    { name: '9', class: 'tile-light' },
    { name: '11', class: 'tile-light' },
    { name: '13', class: 'tile-light' },
  ]

  public selectedParam = {
    note: '',
    quality: '',
    num: '',
    search: ''
  }

  public chords: any[] = [];

  public notation: boolean = false


  constructor() { }

  //-------------------------------------------------------------------
  // action buttons
  //-------------------------------------------------------------------
  public randomizeTiles() {
    console.log('randomize!');
  }
  public deleteTiles() {
    console.log('delete!');
  }
  public translateTiles() {
    console.log('translate!');
    // this.notation = !this.notation;
  }
  public goToInfo() {
    console.log('info!');

  }

  selectTile(tile, value) {
    if (this.selectedParam[tile] != value) {
      this.selectedParam[tile] = value;
    } else {
      this.selectedParam[tile] = '';
    }

    this.colorTiles();
  }

  colorTiles() {
    this.notes.map(note => {
      if (note.name == this.selectedParam.note) {
        note.class = 'tile-ruby';
      }
      else {
        note.class = 'tile-light';
      }
    })
    this.qualities.map(quality => {
      if (quality.name == this.selectedParam.quality) {
        quality.class = 'tile-ruby';
      }
      else {
        quality.class = 'tile-light';
      }
    })
    this.numbers.map(num => {
      if (num.name == this.selectedParam.num) {
        num.class = 'tile-ruby';
      }
      else {
        num.class = 'tile-light';
      }
    })

  }


  public pushAll() {
    this.chords = ChordType.all()
  }


  public a(a) {
    console.log('sees')
  }



  ngOnInit() {
  }

}
