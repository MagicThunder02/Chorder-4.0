import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'explain-buttons',
  templateUrl: './explain-buttons.component.html',
  styleUrls: ['./explain-buttons.component.scss'],
})
export class ExplainButtonsComponent implements OnInit {

  @Input() buttons

  constructor() { }

  ngOnInit() {
    console.log(this.buttons);


  }

}
