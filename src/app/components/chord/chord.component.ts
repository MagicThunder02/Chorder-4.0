import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Note, Chord, Interval } from '@tonaljs/tonal';
import { AccidentPipe } from 'src/app/pipes/accident';
import * as Tone from 'tone'

@Component({
  selector: 'app-chord',
  templateUrl: './chord.component.html',
  styleUrls: ['./chord.component.scss'],
})
export class ChordComponent implements OnInit {

  public buttons = [
    {
      name: 'back',
      icon: 'arrow-back',
      action: () => this.modalController.dismiss()
    },

    {
      name: 'info',
      icon: 'information',
      action: () => console.log('info!')
    }
  ]

  public instruments: any[] = [
    { name: "violin", color: 'light' },
    { name: "piano", color: 'light' },
    { name: "saxophone", color: 'light' },
    { name: "guitar", color: 'light' },
    { name: "flute", color: 'light', }
  ];

  public semitones = 0;

  @Input() tilesList: any[] = [];
  @Input() chord: any;
  @Input() notation: boolean;

  public synth;



  constructor(private accidentPipe: AccidentPipe, private modalController: ModalController) { }

  public buildChord() {
    console.log(this.chord);

    let [name, bass] = this.chord.split('/');
    this.chord = Chord.get(name);

    this.chord.displayNotes = this.chord.notes.map(note => {
      // console.log('note', note, this.tilesList);

      if ((!this.tilesList.some(tile => tile.name == note) && this.tilesList.length != 0)) {
        return note = this.accidentPipe.transform(note)
      }
      else {
        return note
        // return Note.simplify(note)
      }
    }
    )

    if (bass) {
      this.chord.symbol += `/${bass}`;
      this.chord.root = bass;
    }

    this.chord.extensions = Chord.extended(this.chord.symbol);
    this.chord.reductions = Chord.reduced(this.chord.symbol);

    this.chord.showExtensions = false;
    this.chord.showReductions = false;

    this.chord.transposition = this.chord.symbol;


    console.log('chord:', this.chord);



  }

  public inputChord(chordName) {
    this.modalController.dismiss();
    this.openChord(chordName)
  }

  public transposeUp() {
    this.semitones++;


    let transposedTonic = Note.transpose(this.chord.tonic, Interval.fromSemitones(this.semitones))
    this.chord.transposition = this.chord.symbol.replace(this.chord.tonic, Note.simplify(transposedTonic))

    if (this.chord.tonic != this.chord.root) {
      let transposedRoot = Note.transpose(this.chord.root, Interval.fromSemitones(this.semitones))
      this.chord.transposition = this.chord.transposition.replace(this.chord.root, Note.simplify(transposedRoot))
    }

    console.log('symbol', this.chord.symbol, 'this.chord.tonic', this.chord.tonic, 'transposedTonic', transposedTonic);


  }

  public transposeDown() {
    this.semitones--;

    let transposedTonic = Note.transpose(this.chord.tonic, Interval.fromSemitones(this.semitones))
    this.chord.transposition = this.chord.symbol.replace(this.chord.tonic, Note.simplify(transposedTonic))

    if (this.chord.tonic != this.chord.root) {
      let transposedRoot = Note.transpose(this.chord.root, Interval.fromSemitones(this.semitones))
      this.chord.transposition = this.chord.transposition.replace(this.chord.root, Note.simplify(transposedRoot))
    }

    console.log('symbol', this.chord.symbol, 'this.chord.tonic', this.chord.tonic, 'transposedTonic', transposedTonic);



  }

  public async openChord(chord) {
    const modal = await this.modalController.create({
      component: ChordComponent,
      cssClass: 'fullscreen',
      componentProps: {
        chord: chord,
        tilesList: [],
        notation: this.notation
      }
    });
    return await modal.present();
  }

  public playChord(instrument) {

    this.instruments.map(i => i.color = 'light');
    instrument.color = 'ruby'


    let notes = this.chord.notes.map((note, idx) => {
      if (parseInt(this.chord.intervals[idx].slice(0, -1)) <= 7) {
        return note = Note.simplify(note) + '3'
      } else {
        return note = Note.simplify(note) + '4'
      }
    })

    console.log(notes, this.chord.intervals);

    this.synth = new Tone.Sampler({
      urls: {
        A3: `${instrument.name}.mp3`,
      },
      baseUrl: "assets/instruments-sounds/",
      volume: -6,


      onload: () => {

        notes.forEach((note, idx) => {
          this.synth.triggerAttackRelease(note, 2, Tone.now() + idx / 2);
        })

        this.synth.triggerAttackRelease(notes, 4, Tone.now() + notes.length / 2 + 0.5);
      }
    }).toDestination();

    // this.synth.triggerAttackRelease(this.chord.notes, "2n");
  }

  ngOnChanges(changes: SimpleChanges) {
    this.buildChord();
  }

  ngOnInit() {
    this.buildChord();

    this.synth = new Tone.Sampler({
      urls: {
        A3: `piano.mp3`,
      },
      baseUrl: "assets/instruments-sounds/",

    }).toDestination();

  }


}
