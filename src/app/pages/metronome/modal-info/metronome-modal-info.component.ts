import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-metronome-modal-info',
  templateUrl: './metronome-modal-info.component.html',
  styleUrls: ['./metronome-modal-info.component.scss', '../main/metronome.page.scss'],
})

export class MetronomeModalInfoComponent implements OnInit {
  @Input() buttons;

  constructor(public modalController: ModalController) { }


  ngOnInit() {

  }

}
