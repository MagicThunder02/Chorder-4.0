import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'musicNotation'
})
export class MusicNotationPipe implements PipeTransform {

  public notation = ''
  constructor() {
  }

  transform(value: string, translate: boolean, ...args: string[]): string {

    if (value) {

      value = value.toString()

      if (translate) {

        value = value.replaceAll('D', 'Re');
        value = value.replaceAll('C', 'Do');
        value = value.replaceAll('E', 'Mi');
        value = value.replaceAll('F', 'Fa');
        value = value.replaceAll('G', 'Sol');
        value = value.replaceAll('A', 'La');
        value = value.replaceAll('B', 'Si');

      }
      value = value.replaceAll('b', '\u266D');
      value = value.replaceAll('#', '\u266F');
      value = value.replaceAll('^', '\u0394');

      return value;
    }
  }

}
