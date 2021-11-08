import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Chord, Interval, Note } from '@tonaljs/tonal';
import { ChordComponent } from 'src/app/components/chord/chord.component';

@Component({
  selector: 'app-chordmaker',
  templateUrl: './chordmaker.page.html',
  styleUrls: ['./chordmaker.page.scss'],
})
export class ChordmakerPage implements OnInit {

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

  public tiles = [];
  public selectedTiles = [];
  public chords: any[] = [];
  public notation: boolean = false;

  constructor(private modalController: ModalController) {
    this.initTiles();
  }

  //-------------------------------------------------------------------
  // generate the tiles
  //-------------------------------------------------------------------
  public initTiles() {
    let scale = ["Cb", "C", "C#", "Db", "D", "D#", "Eb", "E", "E#", "Fb", "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B", "B#"]
    scale.forEach(note => {
      this.tiles.push({ name: note, class: "tile-light" })
    });
  }

  //-------------------------------------------------------------------
  // action buttons
  //-------------------------------------------------------------------
  public randomizeTiles() {
    console.log('randomize!');
    this.chords = [];
    this.selectedTiles = [];

    let tmpArray = []
    this.tiles.forEach(tile => tmpArray.push(tile))

    //finche non trova un accordo
    while (this.chords.length == 0) {
      //ordina casualmente le tiles
      let shuffled = tmpArray.sort(() => 0.5 - Math.random());

      //prende un sottoinsieme dell'array di 4 note
      this.selectedTiles = shuffled.slice(0, 4);
      console.log('selected tiles', this.selectedTiles);

      this.checkEqualTile();

      let notes = this.selectedTiles.map(tile => tile.name);
      let simplifiedNotes = this.selectedTiles.map(tile => Note.simplify(tile.name));

      //se l'accordo esiste lo usa
      let chord = Chord.detect(notes).concat(Chord.detect(simplifiedNotes))
      console.log(chord);



      if (chord) {
        this.chords = [...new Set(chord)]
      }

    }

    this.colorTiles();
  }

  public deleteTiles() {
    this.selectedTiles = [];
    this.chords = [];
    this.colorTiles();
    console.log('delete!');
  }
  public translateTiles() {
    console.log('translate!');
    this.notation = !this.notation;
  }
  public goToInfo() {
    console.log('info!');

  }

  //------------------------------------
  // tile functions
  //------------------------------------

  public selectTile(tile) {
    this.toggleTile(tile);
    this.checkEqualTile();
    this.colorTiles();
    this.findChord();
  }

  //select or deselect a tile
  public toggleTile(tile) {
    if (this.selectedTiles.includes(tile)) {
      this.selectedTiles.splice(this.selectedTiles.indexOf(tile), 1);
    }
    else {
      this.selectedTiles.push(tile);
    }
  }

  //check if two note with the same value are both checked, if yes deselects the last selected one
  public checkEqualTile() {

    this.selectedTiles.forEach((selectedTile) => {

      //if the interval is 0 
      this.selectedTiles.forEach(tile => {

        let interval = Interval.distance(tile.name, selectedTile.name);

        if ((Interval.semitones(interval) == 0 || Interval.semitones(interval) == 12) && tile.name != selectedTile.name) {
          this.selectedTiles.splice(this.selectedTiles.indexOf(selectedTile), 1);
          return
        }
      })

    });

  }

  //color the tiles if selected
  public colorTiles() {

    this.tiles.forEach(tile => {
      tile.class = "tile-light";
    })



    this.selectedTiles.forEach((selectedTile, idx) => {
      let found = this.tiles.find(tile => tile.name == selectedTile.name)

      if (idx == 0) {
        found.class = "tile-ruby";
      }
      else {
        found.class = "tile-salmon";
      }

    })
  }


  public findChord() {
    this.chords = [];

    //il filtro è la prima nota premuta
    // if (this.selectedTiles[0]) {
    //   filter = this.selectedTiles[0].name;
    // }

    let notes: string[] = this.selectedTiles.map(tile => tile.name);
    let simplifiedNotes: string[] = this.selectedTiles.map(tile => Note.simplify(tile.name));


    if (notes.length >= 2) {
      this.chords = Chord.detect(notes).concat(Chord.detect(simplifiedNotes));
      this.chords = [...new Set(this.chords)];

      console.log(this.chords);

    }
    else {
      this.chords = [];
    }
  }

  public inputChord(chordName) {
    this.modalController.dismiss();
    this.openChord(chordName)
  }

  public async openChord(chord) {
    const modal = await this.modalController.create({
      component: ChordComponent,
      cssClass: 'fullscreen',
      componentProps: {
        chord: chord,
        tilesList: this.selectedTiles,
        notation: this.notation
      }
    });
    return await modal.present();
  }


  ngOnInit() {
  }

}
