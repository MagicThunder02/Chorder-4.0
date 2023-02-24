import { Pipe, PipeTransform } from '@angular/core';
import { Interval } from '@tonaljs/tonal';

@Pipe({
  name: 'accidentPipe'
})
export class AccidentPipe implements PipeTransform {


  constructor() {
  }

  transform(givenNote: string, ...args: string[]): string {

    let scale = ["Cb", "C", "C#", "Db", "D", "D#", "Eb", "E", "E#", "Fb", "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B", "B#"]

    //find the other note with that value
    let note = scale.find(note => {
      // chord.notes = chord.notes.map(note => Note.simplify(note))
      let interval = Interval.distance(note, givenNote);
      return ((Interval.semitones(interval) == 0 || Interval.semitones(interval) == 12) && note != givenNote)
    })

    return givenNote += ` (${note})`
  }

}
