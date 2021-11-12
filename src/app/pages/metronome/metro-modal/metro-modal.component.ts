import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-metro-modal',
  templateUrl: './metro-modal.component.html',
  styleUrls: ['./metro-modal.component.scss'],
})
export class MetroModalComponent implements OnInit {

  public buttons = [
    {
      name: 'back',
      icon: 'arrow-back',
      color: 'ruby',
      action: () => this.goBack()
    },
    {
      name: 'animate',
      icon: 'eye',
      color: 'light',
      action: () => this.animateMetro()
    },
    {
      name: 'mute',
      icon: 'volume-mute',
      color: 'light',
      action: () => this.muteMetro()
    },
    {
      name: 'info',
      icon: 'information',
      color: 'ruby',
      action: () => this.goToInfo()
    }
  ]
  constructor(private modalController: ModalController) { }

  //-------------------------------------------------------------------
  // torna alle impostazioni
  //-------------------------------------------------------------------
  public goBack() {
    this.modalController.dismiss()
    console.log('go back!');
  }
  //-------------------------------------------------------------------
  // toggla l'animazione del metronomo
  //-------------------------------------------------------------------
  public animateMetro() {
    console.log('amimate!');
  }
  //-------------------------------------------------------------------
  // toggla il suono del metronomo
  //-------------------------------------------------------------------
  public muteMetro() {
    console.log('mute!');
  }
  //-------------------------------------------------------------------
  // torna alle impostazioni
  //-------------------------------------------------------------------
  public goToInfo() {
    this.modalController.dismiss()
    console.log('go back!');
  }


  ngOnInit() { }

}
