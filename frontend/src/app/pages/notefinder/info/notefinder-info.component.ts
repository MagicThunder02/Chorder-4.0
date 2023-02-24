import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-notefinder-info',
  templateUrl: './notefinder-info.component.html',
  styleUrls: ['./notefinder-info.component.scss', '../main/notefinder.page.scss'],
})
export class NotefinderInfoComponent implements OnInit {
  @Input() buttons;
  @Input() notes;
  @Input() qualities;
  @Input() numbers;

  constructor(public modalController: ModalController, public global: GlobalService) { }

  ngOnInit() {

  }

}
