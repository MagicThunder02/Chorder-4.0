import { Component, Input, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Gesture, GestureController, ModalController, Platform } from '@ionic/angular';
import { MetronomeInfoComponent } from '../info/metronome-info.component';
import { MetroModalComponent } from '../metro-modal/metro-modal.component';


@Component({
  selector: 'app-metronome',
  templateUrl: './metronome.page.html',
  styleUrls: ['./metronome.page.scss'],
})
export class MetronomePage implements OnInit {

  @ViewChildren('accordion') accordionList
  @ViewChildren('addbutton') addbuttons
  @ViewChildren('removebutton') removebuttons


  public buttons = [
    {
      name: 'add',
      icon: 'add',
      color: 'ruby',
      action: () => this.addMetronome(),
    },
    {
      name: 'animations',
      icon: 'eye',
      color: 'ruby',
      action: () => this.animateMetro(),
    },
    {
      name: 'mute',
      icon: 'volume-high',
      color: 'ruby',
      action: () => this.muteMetro(),
    },
    {
      name: 'info',
      icon: 'information',
      color: 'ruby',
      action: () => this.goToInfo()
    }
  ]

  public colorArray: string[] = ['dark', 'primary', 'secondary', 'tertiary', 'ruby', 'warning', 'success'];
  public soundArray: string[] = ['woodblock', 'note', 'snare', "cymbals"];
  public metronomeCounter: number = 1;
  public gestureArray: Gesture[] = [];

  public metronome = {
    bpm: 120,
    status: false,
    tempo: 'allegro',
    mute: false,
    animation: true,
    train: {
      active: false,
      class: 'tile-light',
      final: 160,
      step: 10,
      measures: 4,
      count: 0
    },
    tap: {
      active: false,
      class: 'tile-light',
      timer: null,
      first: 0,
      average: 0,
      deltas: [],
      buffer: 8,
      resetTime: 4000
    },
    tracks: [
      {
        name: this.metronomeCounter++,
        beats: 4,
        color: this.colorArray[Math.floor(Math.random() * this.colorArray.length)], //colore casuale
        sound: 'woodblock',
        synth: null,
        drawings: {
          balls: [],
          circle: {}
        }
      }
    ]
  }

  constructor(
    private modalController: ModalController,
    private gestureCtrl: GestureController,
    private platform: Platform
  ) { }

  //-------------------------------------------------------------------
  // aggiunge un metronomo
  //-------------------------------------------------------------------
  public addMetronome() {
    //prende un colore non ancora usato
    let tmpArray = this.colorArray.filter(color => this.metronome.tracks.every(track => track.color != color))

    if (this.metronome.tracks.length < 3) {
      this.metronome.tracks.push({
        name: this.metronomeCounter++,
        beats: 4,
        color: tmpArray[Math.floor(Math.random() * tmpArray.length)], //colore casuale
        sound: 'woodblock',
        synth: null,
        drawings: {
          balls: [],
          circle: {}
        }
      })

    }

    console.log('add!');
  }

  //-------------------------------------------------------------------
  // cancella l'ulitmo metronomo
  //-------------------------------------------------------------------
  public deleteMetro() {
    if (this.metronome.tracks.length > 1) {
      this.metronome.tracks.pop()
      console.log('delete!');
    }
  }
  //-------------------------------------------------------------------
  // toggla l'animazione del metronomo
  //-------------------------------------------------------------------
  public animateMetro() {
    console.log('animate!');
    this.metronome.animation = !this.metronome.animation;
    let button = this.buttons.find(button => button.name == 'animations')
    if (this.metronome.animation) {
      button.color = 'ruby';
      button.icon = 'eye';
    } else {
      button.color = 'light';
      button.icon = 'eye-off';
    }
  }
  //-------------------------------------------------------------------
  // apre le info 
  //-------------------------------------------------------------------
  public async goToInfo() {
    console.log('info!');
    const modal = await this.modalController.create({
      component: MetronomeInfoComponent,
      componentProps: {
        buttons: this.buttons,
      },
      cssClass: 'fullscreen',
    });
    return await modal.present();
  }

  //-------------------------------------------------------------------
  // toggla il suono del metronomo
  //-------------------------------------------------------------------
  public muteMetro() {
    console.log('mute!');
    this.metronome.mute = !this.metronome.mute;
    let button = this.buttons.find(button => button.name == 'mute')
    if (!this.metronome.mute) {
      button.color = 'ruby';
      button.icon = 'volume-high';
    } else {
      button.color = 'light';
      button.icon = 'volume-mute';
    }
  }


  //-------------------------------------------------------------------
  // attiva o disattiva la modalità train
  //-------------------------------------------------------------------
  public toggleTrain() {
    this.metronome.train.active = !this.metronome.train.active;

    if (this.metronome.train.active) {
      this.metronome.train.class = 'tile-ruby';
    }
    else {
      this.metronome.train.class = 'tile-light';
    }
  }

  //-------------------------------------------------------------------
  // inizia il tap del tempo
  //-------------------------------------------------------------------
  public tapBpm() {
    this.metronome.tap.active = true;
    if (this.metronome.tap.active) {
      this.metronome.tap.class = 'tile-ruby';
    }

    //dopo un certo numero di secondi (resetTime) il conto è riinizializzato
    clearTimeout(this.metronome.tap.timer);
    this.metronome.tap.timer = setTimeout(() => {
      this.metronome.tap.first = 0;
      this.metronome.tap.deltas = [];
      this.metronome.tap.average = 0;
      this.metronome.tap.active = false;
      this.metronome.tap.class = 'tile-light';

      console.log('Reset timer!')
    }, this.metronome.tap.resetTime);

    //se non è il primo tap 
    if (this.metronome.tap.first != 0) {
      //se ci sono più differenze di quelle che il buffer consente si elimina l'ultima
      if (this.metronome.tap.deltas.length > this.metronome.tap.buffer) {
        this.metronome.tap.deltas.shift();
      }
      //si aggiunge alle differenze il bpm nuovo cioè l'ultimo tap meno quello prima
      this.metronome.tap.deltas.push(60 / ((Date.now() - this.metronome.tap.first) / 1000));
      //il tap di ora diventa quello di prima
      this.metronome.tap.first = Date.now();
    }

    //se è il primo tap viene inizializzato
    if (this.metronome.tap.first == 0) {
      this.metronome.tap.first = Date.now();
    }

    //viene calcolata la media tra tutti 
    this.metronome.tap.average = 0;
    this.metronome.tap.deltas.forEach(delta => {
      this.metronome.tap.average += delta;
    })

    this.metronome.tap.average = this.metronome.tap.average / this.metronome.tap.deltas.length;

    if (this.metronome.tap.average) {
      this.metronome.bpm = Math.round(this.metronome.tap.average);
    }

    this.checkValues();

  }

  //-------------------------------------------------------------------
  // aggiungono o tolgono 1 dai vari valori
  //-------------------------------------------------------------------
  public removeBpm() {
    this.metronome.bpm--;
    this.checkValues();
  }
  public addBpm() {
    this.metronome.bpm++;
    this.checkValues();
  }
  public trainRemoveBpm(type) {
    this.metronome.train[type]--;
    this.checkValues();
  }
  public trainAddBpm(type) {
    this.metronome.train[type]++;
    this.checkValues();
  }
  public trackRemoveBeat(track) {
    track.beats--
    this.checkValues();
  }
  public trackAddBeat(track) {
    track.beats++;
    this.checkValues();
  }
  //-------------------------------------------------------------------
  // vanno avanti e indietro col colore del metronomo
  //-------------------------------------------------------------------
  public trackRemoveColor(track) {
    let i = this.colorArray.indexOf(track.color);
    if (i == 0) {
      i = this.colorArray.length
    }
    track.color = this.colorArray[i - 1]
    this.checkValues();
  }
  public trackAddColor(track) {
    let i = this.colorArray.indexOf(track.color);
    if (i == this.colorArray.length - 1) {
      i = -1;
    }
    track.color = this.colorArray[i + 1]
    this.checkValues();
  }
  //-------------------------------------------------------------------
  // vanno avanti e indietro col suono del metronomo
  //-------------------------------------------------------------------
  public trackRemoveSound(track) {
    let i = this.soundArray.indexOf(track.sound);
    if (i == 0) {
      i = this.soundArray.length
    }
    track.sound = this.soundArray[i - 1]
    this.checkValues();
  }
  public trackAddSound(track) {
    let i = this.soundArray.indexOf(track.sound);
    if (i == this.soundArray.length - 1) {
      i = -1;
    }
    track.sound = this.soundArray[i + 1]
    this.checkValues();
  }

  //-------------------------------------------------------------------
  // controlla che tutti i valori non sforino
  //-------------------------------------------------------------------
  public checkValues() {

    if (this.metronome.bpm < 30) { this.metronome.bpm = 30; }
    if (this.metronome.bpm > 300) { this.metronome.bpm = 300; }

    if (this.metronome.train.final < this.metronome.bpm) { this.metronome.train.final = this.metronome.bpm + 10; }
    if (this.metronome.train.final < 30) { this.metronome.train.final = 30; }
    if (this.metronome.train.final > 300) { this.metronome.train.final = 300; }

    if (this.metronome.train.step < 1) { this.metronome.train.step = 1; }
    if (this.metronome.train.step > 30) { this.metronome.train.step = 30; }

    if (this.metronome.train.measures < 1) { this.metronome.train.measures = 1; }
    if (this.metronome.train.measures > 12) { this.metronome.train.measures = 12; }

    this.metronome.tracks.forEach(track => {
      if (track.beats < 1) { track.beats = 1; }
      if (track.beats > 12) { track.beats = 12; }
    })

    //aggiusto il nome del tempo
    if (this.metronome.bpm < 40) {
      this.metronome.tempo = 'grave';
    }
    else if (this.metronome.bpm < 60) {
      this.metronome.tempo = 'largo';
    }
    else if (this.metronome.bpm < 65) {
      this.metronome.tempo = 'larghetto';
    }
    else if (this.metronome.bpm < 75) {
      this.metronome.tempo = 'adagio';
    }
    else if (this.metronome.bpm < 90) {
      this.metronome.tempo = 'andante';
    }
    else if (this.metronome.bpm < 105) {
      this.metronome.tempo = 'moderato';
    }
    else if (this.metronome.bpm < 115) {
      this.metronome.tempo = 'allegretto';
    }
    else if (this.metronome.bpm < 130) {
      this.metronome.tempo = 'allegro';
    }
    else if (this.metronome.bpm < 165) {
      this.metronome.tempo = 'vivace';
    }
    else if (this.metronome.bpm < 200) {
      this.metronome.tempo = 'presto';
    }
    else {
      this.metronome.tempo = 'prestissimo';
    }

  }

  ngOnInit() {

  }

}
