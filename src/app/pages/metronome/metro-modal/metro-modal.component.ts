import { Component, Input, OnInit } from '@angular/core';
import { createAnimation, ModalController, Platform } from '@ionic/angular';
import * as Tone from 'tone'


@Component({
  selector: 'app-metro-modal',
  templateUrl: './metro-modal.component.html',
  styleUrls: ['./metro-modal.component.scss'],
})
export class MetroModalComponent implements OnInit {

  @Input() inputMetronome

  public metronome

  public buttons = [
    {
      name: 'back',
      icon: 'arrow-back',
      color: 'ruby',
      action: () => this.goBack()
    },
    {
      name: 'animate',
      icon: 'eye',
      color: 'ruby',
      action: () => this.animateMetro()
    },
    {
      name: 'mute',
      icon: 'volume-high',
      color: 'ruby',
      action: () => this.muteMetro()
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
  ) { }

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
  // torna alle impostazioni
  //-------------------------------------------------------------------
  public goToInfo() {
    this.modalController.dismiss()
    console.log('go back!');
  }


  //-----------------------------------------------------------------------------------------------------------------
  // INIZIO FUNZIONI DI DISEGNO
  //-----------------------------------------------------------------------------------------------------------------

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
      track.drawings.circle = { color: 'dark', diameter: 0, thickness: 2, cX: 0, cY: 0 };
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
      let x0 = this.platform.width() / 2 - track.drawings.circle.diameter / 2
      let y0 = this.platform.height() / 2 - track.drawings.circle.diameter / 2 + this.platform.height() / 8

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
        ball.cX = x0 + (track.drawings.circle.diameter / 2) * Math.cos(angle - Math.PI / 2) - track.drawings.balls[0].diameter / 2;
        ball.cY = y0 + (track.drawings.circle.diameter / 2) * Math.sin(angle - Math.PI / 2) - track.drawings.balls[0].diameter / 2;
      })
    })

  }

  //-------------------------------------------------------------------
  // anima la ball
  //-------------------------------------------------------------------
  public animateBall(ball, color) {
    //prende il colore scuro o chiare a seconda di quale battito sia
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

  }


  //-----------------------------------------------------------------------------------------------------------------
  // INIZIO FUNZIONI SONORE
  //-----------------------------------------------------------------------------------------------------------------

  public initializeMetronome() {
    this.metronome.tracks.forEach(track => {
      let sampler = new Tone.Sampler({
        urls: {
          C3: `${track.sound}C3.mp3`,
          F2: `${track.sound}F2.mp3`,
        },
        baseUrl: "assets/instruments-sounds/"

      }).toDestination();
      track.synth = sampler;
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
          if (ballIdx == 0) {
            track.synth.triggerAttackRelease('C3', "4n", time);
          }
          else {
            track.synth.triggerAttackRelease('F2', "4n", time);
          }
        }

        //se le animazioni sono abilitate
        if (this.metronome.animation) {
          this.animateBall(track.drawings.balls[ballIdx], track.color)
        }

        console.log('idx', ballIdx);
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


      console.log('count', this.metronome.train.count);

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

  public playMetronome() {
    Tone.Transport.position = 0;
    Tone.Transport.start();
    // Tone.Transport.start(0);
    console.log('start');

  }

  public pauseMetronome() {
    Tone.Transport.stop()
    console.log('stop');
  }



  ngOnInit() {
    // root.style.setProperty('--mouse-x', e.clientX + "px");

    this.metronome = { ...this.inputMetronome }


    this.inizializeDrawings();
    this.calcBallsRadius();
    this.calcCircleRadius();
    this.calcBallsPosition();

    Tone.start()
    this.initializeMetronome()
    this.createLoop()

    console.log('tracks:', this.metronome.tracks);

  }

}
