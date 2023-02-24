import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  public languages: string[] = ['en', 'it'];
  public notations: string[] = ['us', 'eu'];

  constructor(public global: GlobalService, private translate: TranslateService) {
  }

  public setLanguage(language) {
    this.global.language = language;
    this.translate.use(this.global.language);

    localStorage.setItem('language', this.global.language);
  }

  public setNotation(notation) {
    this.global.notation = notation;
    localStorage.setItem('notation', this.global.notation);

  }

  public setDarkmode() {
    if (this.global.darkmode) {
      document.body.setAttribute('color-theme', 'dark');
      localStorage.setItem('darkmode', 'true');
    }
    else {
      document.body.setAttribute('color-theme', 'light');
      localStorage.setItem('darkmode', 'false');
    }

  }

  ngOnInit() {
  }

}
