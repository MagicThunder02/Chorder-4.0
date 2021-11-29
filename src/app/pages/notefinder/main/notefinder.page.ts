import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Chord, ChordType } from '@tonaljs/tonal';
import { ChordComponent } from 'src/app/components/chord/chord.component';
import { GlobalService } from 'src/app/services/global.service';
import { SwiperComponent } from 'swiper/angular';
import { NotefinderInfoComponent } from '../info/notefinder-info.component';

@Component({
  selector: 'app-notefinder',
  templateUrl: './notefinder.page.html',
  styleUrls: ['./notefinder.page.scss'],
})
export class NotefinderPage implements OnInit {
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;

  //-------------------------------------------------------------------
  // action buttons
  //-------------------------------------------------------------------
  public buttons = [
    {
      name: 'random',
      icon: 'shuffle',
      color: 'ruby',
      action: () => this.randomizeTiles(),
      description: 'Finds a random chord',
    },
    {
      name: 'delete',
      icon: 'trash',
      color: 'ruby',
      action: () => this.deleteTiles(),
      description: 'Unselect all the filters',
    },
    {
      name: 'translate',
      icon: 'language',
      color: 'ruby',
      action: () => this.translateTiles(),
      description: 'Changes the notation of notes'
    },
    {
      name: 'info',
      icon: 'information',
      color: 'ruby',
      action: () => this.goToInfo()
    }
  ]

  //-------------------------------------------------------------------
  // note
  //-------------------------------------------------------------------
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

  //-------------------------------------------------------------------
  // qualità possibili
  //-------------------------------------------------------------------
  public qualities = [
    { name: 'major', class: 'tile-light' },
    { name: 'minor', class: 'tile-light' },
    { name: 'augmented', class: 'tile-light' },
    { name: 'diminished', class: 'tile-light' },
  ]

  //-------------------------------------------------------------------
  // grado possibile 
  //-------------------------------------------------------------------
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

  public notation: boolean = false;


  constructor(private modalController: ModalController, public global: GlobalService) { }

  //-------------------------------------------------------------------
  // sceglie dei parametri casuali per trovare degli accordi
  //-------------------------------------------------------------------
  public randomizeTiles() {
    console.log('randomize!', this.chords.length);

    this.chords = []

    //finche non trova almeno un accordo
    while (this.chords.length == 0) {

      //crea gli array per fare il sort 
      let tmpNotes = [];
      this.notes.forEach(note => {
        tmpNotes.push(note)
      });
      tmpNotes.sort(() => 0.5 - Math.random());

      let tmpQualities = [];
      this.qualities.forEach(note => {
        tmpQualities.push(note)
      });
      tmpQualities.sort(() => 0.5 - Math.random());

      let tmpNUmbers = [];
      this.numbers.forEach(note => {
        tmpNUmbers.push(note)
      });
      tmpNUmbers.sort(() => 0.5 - Math.random());

      //imposta i parametri
      this.selectedParam = {
        note: tmpNotes[0].name,
        quality: tmpQualities[0].name,
        num: tmpNUmbers[0].name,
        search: ''
      }

      //cerca gli accordi
      this.searchChord()

    }

    //trova l'indice della nota nelle slides
    let idx = this.notes.findIndex(note => note.name == this.selectedParam.note)
    //posiziona swiper in modo che la nota selezionata sia in centro
    this.swiper.swiperRef.slideTo((idx + 3))

    //colora i parametri selezionati casualmente
    this.colorTiles()

  }

  //-------------------------------------------------------------------
  // cancella tutte le selezioni
  //-------------------------------------------------------------------
  public deleteTiles() {
    console.log('delete!');

    this.selectedParam = {
      note: '',
      quality: '',
      num: '',
      search: ''
    }

    this.swiper.swiperRef.slideTo(0 + 5)

    this.colorTiles()

    this.chords = [];


  }

  //-------------------------------------------------------------------
  // cambia notazione
  //-------------------------------------------------------------------
  public translateTiles() {
    if (this.global.notation == 'american') {
      this.global.notation = 'european';
    } else {
      this.global.notation = 'american';
    }
    console.log('translate!', this.global.notation);
  }
  public async goToInfo() {
    console.log('info!');
    const modal = await this.modalController.create({
      component: NotefinderInfoComponent,
      componentProps: {
        buttons: this.buttons,
        notes: this.notes,
        qualities: this.qualities,
        numbers: this.numbers
      },
      cssClass: 'fullscreen',
    });
    return await modal.present();
  }

  //-------------------------------------------------------------------
  // ogni volta che un parametro viene selezionato
  //-------------------------------------------------------------------
  public selectTile(tile, value) {
    if (this.selectedParam[tile] != value) {
      this.selectedParam[tile] = value;
    } else {
      this.selectedParam[tile] = '';
    }

    this.colorTiles();

    this.searchChord()
  }

  //-------------------------------------------------------------------
  // cerca l'accordo
  //-------------------------------------------------------------------
  public searchChord() {

    console.log('search', this.selectedParam, Object.keys(this.selectedParam).some(key => this.selectedParam[key] != ''));

    //se almeno un parametro è presente
    if (Object.keys(this.selectedParam).some(key => this.selectedParam[key] != '')) {

      this.chords = []

      //mette tutti gli accordi per essere filtrati
      this.pushAll()

      //se c'è il parametro filtra perchè sia soddisfatto
      if (this.selectedParam.note) {
        this.chords = this.chords.filter(chord => chord.symbol.includes(this.selectedParam.note))
      }
      if (this.selectedParam.quality) {
        //la qualità selezionata deve essere inclusa nella qualità dell'accordo
        this.chords = this.chords.filter(chord => chord.quality.toLowerCase().includes(this.selectedParam.quality))
      }
      if (this.selectedParam.num) {
        //il grado deve essere uno degli intervalli (anche in ottava bassa)
        this.chords = this.chords.filter(chord => chord.intervals.some(interval => interval.includes(this.selectedParam.num) || interval.includes(parseInt(this.selectedParam.num) - 7)))
      }
      // la ricerca della searchbar viene fatta nel simbolo, nel nome, in ogni alias e nella qualità
      if (this.selectedParam.search) {
        this.chords = this.chords.filter(chord =>
          chord.symbol.includes(this.selectedParam.search)
          || chord.name.includes(this.selectedParam.search)
          || chord.aliases.some(alias => alias.includes(this.selectedParam.search))
          || chord.quality.toLowerCase().includes(this.selectedParam.search))
      }

    }
  }

  public colorTiles() {
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
    ChordType.all().forEach(chord => this.chords.push(Chord.get(this.selectedParam.note + chord.aliases[0])))
  }

  public async openChord(chord) {
    const modal = await this.modalController.create({
      component: ChordComponent,
      cssClass: 'fullscreen',
      componentProps: {
        chord: chord,
        notation: this.notation
      }
    });
    return await modal.present();
  }

  ngOnInit() {

  }

}
