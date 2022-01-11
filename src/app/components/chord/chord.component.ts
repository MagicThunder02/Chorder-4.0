import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Note, Chord, Interval } from '@tonaljs/tonal';
import { AccidentPipe } from 'src/app/pipes/accident';
import { GlobalService } from 'src/app/services/global.service';
import * as Tone from 'tone'

@Component({
  selector: 'app-chord',
  templateUrl: './chord.component.html',
  styleUrls: ['./chord.component.scss'],
})
export class ChordComponent implements OnInit {

  //-------------------------------------------------------------------
  //bottoni della pagina
  //-------------------------------------------------------------------
  public buttons = [
    {
      name: 'back',
      icon: 'arrow-back',
      color: 'ruby',
      action: () => this.modalController.dismiss()
    },

    {
      name: 'info',
      icon: 'information',
      color: 'ruby',
      action: () => console.log('info!')
    }
  ]

  //-------------------------------------------------------------------
  //strumenti disponibili
  //-------------------------------------------------------------------
  public instruments: any[] = [
    { name: "violin", color: 'light' },
    { name: "piano", color: 'light' },
    { name: "saxophone", color: 'light' },
    { name: "guitar", color: 'light' },
    { name: "flute", color: 'light', }
  ];

  //tiene conto dei semitoni per la traposizione
  public semitones = 0;

  @Input() tilesList: any[] = [];
  @Input() chord: any;
  @Input() notation: boolean;

  public synth;


  constructor(private accidentPipe: AccidentPipe, private modalController: ModalController, public global: GlobalService) { }


  //-------------------------------------------------------------------
  //costruisce l'accordo 
  //-------------------------------------------------------------------
  public buildChord() {
    console.log(this.chord);

    //estrae nome e basso dall'accordo poi cerca l'accordo solo col nome (tonal non permette ancora la ricerca col basso)
    let [name, bass] = this.chord.split('/');
    this.chord = Chord.get(name);

    //se l'utente ha selezionato delle note improprie (es: E#) la normalizza e poi aggiunge tra parentesi la nota originale
    // vale solo per chordmaker
    this.chord.displayNotes = this.chord.notes.map(note => {
      if ((!this.tilesList.some(tile => tile.name == note) && this.tilesList.length != 0)) {
        return note = this.accidentPipe.transform(note)
      }
      else {
        return note
      }
    }
    )

    //se l'accordo aveva il basso lo aggiunge
    if (bass) {
      this.chord.symbol += `/${bass}`;
      this.chord.root = bass;
    }

    //aggiunge estensioni e riduzioni all'accordo e i rispettivi toggle
    this.chord.extensions = Chord.extended(this.chord.symbol);
    this.chord.reductions = Chord.reduced(this.chord.symbol);

    //aggiunge le scale di riferimento per quell'accordo
    this.chord.scales = Chord.chordScales(this.chord.symbol);

    this.chord.showExtensions = false;
    this.chord.showReductions = false;
    this.chord.showScales = false;

    //inizializza l'accordo per la trasposizione
    this.chord.transposition = this.chord.symbol;


    console.log('chord:', this.chord);
  }

  //-------------------------------------------------------------------
  // chiama un'altra modal con l'accordo premuto
  // richiede il simbolo dell'accordo
  //-------------------------------------------------------------------
  public inputChord(chordName) {
    this.modalController.dismiss();
    this.openChord(chordName)
  }


  //-------------------------------------------------------------------
  //somma o sottrae un semitono e poi traspone
  //-------------------------------------------------------------------
  public transposeUp() {
    this.semitones++;
    this.transpose()
  }
  public transposeDown() {
    this.semitones--;
    this.transpose()
  }
  public transpose() {
    //traspone la tonica di tot semitoni e la sostituisce alla nota originale nella proprietà trasposition
    let transposedTonic = Note.transpose(this.chord.tonic, Interval.fromSemitones(this.semitones))
    this.chord.transposition = this.chord.symbol.replace(this.chord.tonic, Note.simplify(transposedTonic))

    //se la tonica è diversa dal basso allora traspone anche il basso e lo sostituisce alla nota originale nella proprietà trasposition
    if (this.chord.tonic != this.chord.root) {
      let transposedRoot = Note.transpose(this.chord.root, Interval.fromSemitones(this.semitones))
      this.chord.transposition = this.chord.transposition.replace(this.chord.root, Note.simplify(transposedRoot))
    }

    console.log('symbol', this.chord.symbol, 'this.chord.tonic', this.chord.tonic, 'transposedTonic', transposedTonic);
  }


  //-------------------------------------------------------------------
  //apre la modal con il nuovo accordo
  //-------------------------------------------------------------------
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


  //-------------------------------------------------------------------
  //suona l'accordo con lo strumento fornito
  // rischiede uno strumento
  //-------------------------------------------------------------------
  public playChord(instrument) {

    //colora lo strumento selezionato
    this.instruments.map(i => i.color = 'light');
    instrument.color = 'ruby'

    //prende la tonica (prima nota)
    let tonic = this.chord.notes[0] + '3'

    //crea l'arrai trasponendo la tonica per tutti gli intervalli e la semplifica (tone.js è stupido e non capisce i doppi #)
    let notes = this.chord.intervals.map(interval => Note.simplify(Note.transpose(tonic, interval)))

    //creo il synth con lo strumento selezionato e al caricamento suono
    this.synth = new Tone.Sampler({
      urls: {
        A3: `${instrument.name}.mp3`,
      },
      baseUrl: "assets/instruments-sounds/",
      volume: -6,

      //suono l'accordo moltiplicando la durata di ogni nota per la sua posizione in modo da farle suonare tutte lunghe uguali
      onload: () => {

        //arpeggiato
        notes.forEach((note, idx) => {
          this.synth.triggerAttackRelease(note, 2 * (idx + 1), Tone.now() + idx / 2);
        })

        //insieme
        notes.forEach((note, idx) => {
          this.synth.triggerAttackRelease(note, 2 * (idx + 1), Tone.now() + notes.length / 2 + 0.5);
        })
      }
    }).toDestination();
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
