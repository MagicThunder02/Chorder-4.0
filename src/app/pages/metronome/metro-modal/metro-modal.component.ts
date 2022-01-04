import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import * as Tone from 'tone'
import { MetronomeModalInfoComponent } from '../modal-info/metronome-modal-info.component';
import _ from "lodash"

@Component({
  selector: 'app-metro-modal',
  templateUrl: './metro-modal.component.html',
  styleUrls: ['./metro-modal.component.scss'],
})
export class MetroModalComponent {

  @Input() metronome  //metronomo 
  public oldMetronome  //variabile guardata per il changedetection 


  public container       //variabile in cui setto il centro del metronomo

  public buttons = [
    {
      name: 'back',
      icon: 'arrow-back',
      color: 'ruby',
      action: () => this.goBack(),
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


  constructor(
    private modalController: ModalController,
    private platform: Platform,
  ) {
  }

  //-------------------------------------------------------------------
  // torna alle impostazioni
  //-------------------------------------------------------------------
  public goBack() {
    Tone.Transport.stop()
    Tone.Transport.cancel()
    this.modalController.dismiss()
    console.log('go back!');
  }
  //-------------------------------------------------------------------
  // toggla l'animazione del metronomo
  //-------------------------------------------------------------------
  public animateMetro() {
    console.log('animate!');
    this.metronome.animation = !this.metronome.animation;
    let button = this.buttons.find(button => button.name == 'animate')
    if (this.metronome.animation) {
      button.color = 'ruby';
      button.icon = 'eye';
    } else {
      button.color = 'light';
      button.icon = 'eye-off';
    }
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
  // go to info
  //-------------------------------------------------------------------
  public async goToInfo() {

    console.log('info!');

    const modal = await this.modalController.create({
      component: MetronomeModalInfoComponent,
      componentProps: {
        buttons: this.buttons
      },
      cssClass: 'fullscreen',
    });
    return await modal.present();
  }


  //-----------------------------------------------------------------------------------------------------------------
  // INIZIO FUNZIONI DI DISEGNO
  //-----------------------------------------------------------------------------------------------------------------

  //-------------------------------------------------------------------
  // crea il contenitore del metronomo sulla base del div fornito
  //-------------------------------------------------------------------
  public calcContainer() {
    let x0 = this.platform.width() / 2;
    let y0 = x0;

    this.container = {
      x0: x0,
      y0: y0,
    }
  }

  //-------------------------------------------------------------------
  // inizializza i disegni e ordina l'array delle tracks
  //-------------------------------------------------------------------
  public inizializeDrawings() {

    //ordina le tracks da quella con più beats a quella con meno beats (decrescente)
    this.metronome.tracks.sort((track1, track2) => track2.beats - track1.beats)

    this.metronome.tracks.forEach(track => {
      track.drawings.balls = []
      for (let i = 0; i < track.beats; i++) {
        track.drawings.balls.push(({ color: '--ion-color-medium', class: 'ball', diameter: 0, cX: 0, cY: 0 }));
      }
      track.drawings.circle = { color: 'var(--ion-color-dark)', diameter: 0, thickness: 2, cX: 0, cY: 0 };
    })

  }

  //-------------------------------------------------------------------
  // assegna il raggio alle palle
  //-------------------------------------------------------------------
  public calcBallsRadius() {
    let diameter = this.platform.width() / 8 - (this.metronome.tracks.length * 4)

    this.metronome.tracks.forEach(track => {
      track.drawings.balls.map(ball => ball.diameter = diameter)
    })
  }

  //-------------------------------------------------------------------
  // assegna il raggio al cerchio
  //-------------------------------------------------------------------
  public calcCircleRadius() {


    this.metronome.tracks.forEach((track, idx) => {
      //lo spazio da togliere è (due volte il diametro) per ogni traccia e 30 pixel di meno  
      let spaceBetween = track.drawings.balls[0].diameter * 2 * (idx + 1) + (idx * 30);

      // il raggio è uguale alla metà della pagina per ogni indice meno lo spazio da togliere
      track.drawings.circle.diameter = this.platform.width() - spaceBetween;

      //genera il centro del cerchio su cui saranno le balls. All'altezza viene tolto un ulteriore terzo per i bottoni
      let x0 = this.container.x0 - track.drawings.circle.diameter / 2
      // let y0 = this.platform.height() / 2 - track.drawings.circle.diameter / 2 + this.platform.height() / 8
      let y0 = this.container.y0 - track.drawings.circle.diameter / 2

      track.drawings.circle.cX = x0
      track.drawings.circle.cY = y0
    })
  }

  //-------------------------------------------------------------------
  // assegna la posizione alle balls
  //-------------------------------------------------------------------
  public calcBallsPosition() {

    this.metronome.tracks.forEach(track => {
      //centro della pagina
      let x0 = this.platform.width() / 2
      let y0 = this.platform.height() / 2 + this.platform.height() / 8

      track.drawings.balls.forEach((ball, i) => {
        let angle = 2 * Math.PI / track.beats * i;
        ball.cX = this.container.x0 + (track.drawings.circle.diameter / 2) * Math.cos(angle - Math.PI / 2) - track.drawings.balls[0].diameter / 2;
        ball.cY = this.container.y0 + (track.drawings.circle.diameter / 2) * Math.sin(angle - Math.PI / 2) - track.drawings.balls[0].diameter / 2;
      })
    })

  }

  //-------------------------------------------------------------------
  // anima la ball
  //-------------------------------------------------------------------
  public animateBall(ball, color) {
    //prende il colore scuro o chiare a seconda di quale battito sia
    try {
      if (this.metronome.tracks[0].drawings.balls.indexOf(ball) == 0) {
        ball.color = `--ion-color-${color}-shade`;
      }
      else {
        ball.color = `--ion-color-${color}`
      }
      //assegna la classe animata
      ball.class = 'ball-animated';

      //dopo 0.5 secondi la toglie
      setTimeout(() => {
        ball.class = 'ball';
        ball.color = '--ion-color-medium'
      }, 500)

    } catch (error) {
      console.log(error);
      this.resetMetronome();
    }

  }


  //-----------------------------------------------------------------------------------------------------------------
  // INIZIO FUNZIONI SONORE
  //-----------------------------------------------------------------------------------------------------------------

  public initializeMetronome() {
    this.metronome.tracks.forEach(track => {
      let sampler = new Tone.Sampler({
        C3: `assets/instruments-sounds/${track.sound}C3.mp3`,
        F2: `assets/instruments-sounds/${track.sound}F2.mp3`,
      },
        {
          onload: () => track.synth = sampler
        }).toDestination();

    })

    Tone.Transport.bpm.value = this.metronome.bpm;
  }

  public createLoop() {
    //il tempo master è quello del primo metronomo (quello con più battiti)
    //https://toolstud.io/music/bpm.php?bpm=120&bpm_unit=8%2F4
    let beatTime = 60 / this.metronome.bpm * this.metronome.tracks[0].beats;
    this.metronome.train.count = 0;


    this.metronome.tracks.forEach((track, i) => {
      //il tempo di ogni traccia è il tempo master diviso i battiti
      let trackTime = beatTime / track.beats

      let ballIdx = 0
      const loop = new Tone.Loop((time) => {

        //se il metronomo non è mutato
        if (!this.metronome.mute) {

          //se il synth è disponibile
          if (track.synth) {
            if (ballIdx == 0) {
              track.synth.triggerAttackRelease('C3', "4n", time);
            }
            else {
              track.synth.triggerAttackRelease('F2', "4n", time);
            }
          }
        }

        //se le animazioni sono abilitate
        if (this.metronome.animation) {
          this.animateBall(track.drawings.balls[ballIdx], track.color)
        }

        // console.log('idx', ballIdx);
        ballIdx++;

        this.increaseBpm()


        if (ballIdx >= track.beats) {
          ballIdx = 0

          //solo se è la traccia master
          if (i == 0) {
            this.metronome.train.count++;

          }

        }

      }, trackTime).start(0);

    })

  }

  private increaseBpm() {
    if (this.metronome.train.active) {


      // console.log('count', this.metronome.train.count);

      if (this.metronome.bpm < this.metronome.train.final) {


        if (this.metronome.train.count >= this.metronome.train.measures) {


          if (this.metronome.bpm + this.metronome.train.step > this.metronome.train.final) {

            this.metronome.bpm = this.metronome.train.final;
          }
          else {
            this.metronome.bpm += this.metronome.train.step;
          }

          Tone.Transport.bpm.value = this.metronome.bpm;

          this.metronome.train.count = 0;
        }
      }
    }
  }


  //spegne il metronomo
  public stopMetronome() {
    console.log('stop');
    Tone.Transport.stop()
    this.metronome.train.count = 0
    Tone.Transport.cancel()

    this.metronome.status = false;
  }

  //accende il metronomo
  public startMetronome() {
    console.log('start');
    Tone.start()

    this.createLoop()

    Tone.Transport.position = 0;
    Tone.Transport.start();

    this.metronome.status = true;
  }

  //se il metronomo è acceso lo spegne e viceversa
  public toggleMetronome() {
    if (this.metronome.status) {
      this.stopMetronome();
    } else {
      this.startMetronome();
    }
  }

  //se il metronomo è acceso lo resetta
  public resetMetronome() {
    this.stopMetronome();
    this.startMetronome();
  }

  ngDoCheck() {


    //se cambia il bpm rigenera il metronomo
    if (this.metronome.bpm != this.oldMetronome.bpm) {
      this.oldMetronome = _.cloneDeep(this.metronome)
      console.log("check");
      this.refreshMetronome();
    }
    //se i battiti cambiano o vengono modificate le tracce rigenera il metronomo e lo restarta
    if (this.metronome.tracks.some((track, idx) => {
      if (this.metronome.tracks.length == this.oldMetronome.tracks.length) {
        return track.beats != this.oldMetronome.tracks[idx].beats
      } else {
        return true
      }
    })) {
      this.oldMetronome = _.cloneDeep(this.metronome)
      this.refreshMetronome();
      this.resetMetronome();
    }

    //se i suoni cambiano rigenera il metronomo 
    if (this.metronome.tracks.some((track, idx) => {
      if (this.oldMetronome.tracks[idx]) {
        return track.sound != this.oldMetronome.tracks[idx].sound
      } else {
        return true
      }
    })) {
      this.oldMetronome = _.cloneDeep(this.metronome)
      this.refreshMetronome();
    }

  }

  refreshMetronome() {
    console.log('start!');

    this.calcContainer();

    this.inizializeDrawings();
    this.calcBallsRadius();
    this.calcCircleRadius();
    this.calcBallsPosition();

    this.initializeMetronome();

    console.log('tracks:', this.metronome.tracks);

  }

  ngOnInit() {
    this.oldMetronome = _.cloneDeep(this.metronome)
    this.refreshMetronome();
  }
}
