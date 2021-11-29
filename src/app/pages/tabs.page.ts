import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  public tabPages = [

    {
      title: 'chordmaker',
      tab: 'chordmaker',
      icon: 'hammer'
    },
    {
      title: 'notefinder',
      tab: 'notefinder',
      icon: 'search'
    },
    {
      title: 'metronome',
      tab: 'metronome',
      icon: 'hourglass'
    },
    {
      title: 'settings',
      tab: 'settings',
      icon: 'cog'
    }
  ]

  constructor() { }

}
