import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  public languages: string[] = ['english', 'italian'];
  public notations: string[] = ['american', 'european'];
  public darkmode = false;

  constructor(public global: GlobalService) {

    // this.translate.setDefaultLang(this.global.language);
    // this.translate.use(this.global.language);
  }

  public setLanguage(language) {
    this.global.language = language;
  }

  public setNotation(notation) {
    this.global.notation = notation;
  }

  public setDarkmode() {
    if (this.darkmode) {
      document.body.setAttribute('color-theme', 'dark');
    }
    else {
      document.body.setAttribute('color-theme', 'light');
    }
  }

  ngOnInit() {
  }

}
