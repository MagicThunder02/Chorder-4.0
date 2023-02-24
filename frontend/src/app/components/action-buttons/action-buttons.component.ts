import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'action-buttons',
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.scss'],
})
export class ActionButtonsComponent implements OnInit {

  @Input() buttons

  constructor() { }

  ngOnInit() { }

}
