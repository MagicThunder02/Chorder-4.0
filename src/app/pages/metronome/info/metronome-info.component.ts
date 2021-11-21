import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-metronome-info',
  templateUrl: './metronome-info.component.html',
  styleUrls: ['./metronome-info.component.scss', '../main/metronome.page.scss'],
})
export class MetronomeInfoComponent implements OnInit {
  @Input() buttons;

  constructor(private modalController: ModalController) { }

  ngOnInit() {

  }

}
