import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  public tabPages = [

    {
      title: 'Chordmaker',
      tab: 'chordmaker',
      icon: 'hammer'
    },
    {
      title: 'Notefinder',
      tab: 'notefinder',
      icon: 'search'
    },
    {
      title: 'Metronome',
      tab: 'metronome',
      icon: 'hourglass'
    }

  ]

  constructor() { }

}
