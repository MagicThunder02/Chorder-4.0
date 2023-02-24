import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public darkmode: boolean = false;
  public notation: string = 'us';
  public language: string = 'en';

  constructor() { }
}
