import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GlobalService } from './services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private translate: TranslateService, private global: GlobalService) {

    //sets the value from the localstorage

    let language = localStorage.getItem('language');
    let notation = localStorage.getItem('notation');
    let darkmode = localStorage.getItem('darkmode');

    //language
    if (language != null) {
      this.global.language = language;
      this.translate.use(language);
    }
    else {
      this.global.language = 'en';
      this.translate.use('en');
    }

    //notation
    if (notation != null) {
      this.global.notation = notation;
    }
    else {
      this.global.notation = 'us';
    }

    //darkmode
    if (darkmode != 'true') {
      this.global.darkmode = false;
      document.body.setAttribute('color-theme', 'light');
    }
    else {
      this.global.darkmode = true;
      document.body.setAttribute('color-theme', 'dark');
    }
  }
}
