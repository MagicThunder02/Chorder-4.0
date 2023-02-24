import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'intervalTransform'
})
export class IntervalPipe implements PipeTransform {


  constructor() {
  }

  transform(interval: string, ...args: string[]): string {

    let newInterval = '';

    if (interval) {

      //guardo l'ultima lettera
      switch (interval[interval.length - 1]) {
        case "P":
          if (interval[0] != "1") {
            newInterval += "perfect";
          }
          break;
        case "m":
          newInterval += "minor";
          break;
        case "M":
          newInterval += "major";
          break;
        case "d":
          newInterval += "diminished";
          break;
        case "A":
          newInterval += "augmented";
          break;
      }

      newInterval += " ";

      //guardo le prima lettere
      switch (interval.slice(0, -1)) {
        case "1":
          newInterval += "unison";
          break;
        case "2":
          newInterval += "second";
          break;
        case "3":
          newInterval += "third";
          break;
        case "4":
          newInterval += "fourth";
          break;
        case "5":
          newInterval += "fifth";
          break;
        case "6":
          newInterval += "sixth";
          break;
        case "7":
          newInterval += "seventh";
          break;
        case "8":
          newInterval += "seventh";
          break;
        case "9":
          newInterval += "ninth";
          break;
        case "11":
          newInterval += "eleventh";
          break;
        case "13":
          newInterval += "thirteenth";
          break;
      }

      return newInterval;
    }
  }

}
