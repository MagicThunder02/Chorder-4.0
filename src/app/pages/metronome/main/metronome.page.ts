import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MetronomeInfoComponent } from '../info/metronome-info.component';
import { MetroModalComponent } from '../metro-modal/metro-modal.component';

@Component({
  selector: 'app-metronome',
  templateUrl: './metronome.page.html',
  styleUrls: ['./metronome.page.scss'],
})
export class MetronomePage implements OnInit {

  public buttons = [
    {
      name: 'add',
      icon: 'add',
      color: 'ruby',
      action: () => this.addMetronome(),
      description: 'Add a metronome to create a polyrhythm'
    },
    {
      name: 'delete',
      icon: 'trash',
      color: 'ruby',
      action: () => this.deleteMetro(),
      description: 'Deletes the last metronome'
    },
    {
      name: 'play',
      icon: 'play',
      color: 'ruby',
      action: () => this.playMetronome(),
      description: 'Starts the metronome'
    },
    {
      name: 'info',
      icon: 'information',
      color: 'ruby',
      action: () => this.goToInfo()
    }
  ]

  public colorArray: string[] = ['dark', 'primary', 'secondary', 'tertiary', 'ruby', 'warning', 'success'];
  public soundArray: string[] = ['woodblock', 'whip', 'snare'];

  public metronome = {
    bpm: 120,
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
        name: 'Metronome #1',
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

  constructor(private modalController: ModalController) { }

  //-------------------------------------------------------------------
  // aggiunge un metronomo
  //-------------------------------------------------------------------
  public addMetronome() {
    //prende un colore non ancora usato
    let tmpArray = this.colorArray.filter(color => this.metronome.tracks.every(track => track.color != color))

    if (this.metronome.tracks.length < 3) {
      this.metronome.tracks.push({
        name: `Metronome #${this.metronome.tracks.length + 1}`,
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
    this.metronome.tracks.pop()
    console.log('delete!');
  }
  //-------------------------------------------------------------------
  // apre la modal 
  //-------------------------------------------------------------------
  public async playMetronome() {
    if (this.metronome.tracks.length > 0) {


      const modal = await this.modalController.create({
        component: MetroModalComponent,
        cssClass: 'fullscreen',
        componentProps: {
          inputMetronome: this.metronome,
        }
      });

      console.log('play!');
      return await modal.present();
    }
  }

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
  }
  public trackAddColor(track) {
    let i = this.colorArray.indexOf(track.color);
    if (i == this.colorArray.length - 1) {
      i = -1;
    }
    track.color = this.colorArray[i + 1]
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
  }
  public trackAddSound(track) {
    let i = this.soundArray.indexOf(track.sound);
    if (i == this.soundArray.length - 1) {
      i = -1;
    }
    track.sound = this.soundArray[i + 1]
  }

  //-------------------------------------------------------------------
  // controlla che tutti i valori non sforino
  //-------------------------------------------------------------------
  private checkValues() {

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
  }


  ngOnInit() {
  }

}
