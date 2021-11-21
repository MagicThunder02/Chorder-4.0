import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-chordmaker-info',
  templateUrl: './chordmaker-info.component.html',
  styleUrls: ['./chordmaker-info.component.scss', '../main/chordmaker.page.scss'],
})
export class ChordmakerInfoComponent implements OnInit {
  @Input() buttons

  constructor(private modalController: ModalController) { }

  ngOnInit() {

  }

}
