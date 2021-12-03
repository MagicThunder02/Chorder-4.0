import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss'],
})
export class AddButtonsComponent implements OnInit {

  @Input() context
  @Input() size

  @Output() addEvent = new EventEmitter<string>();

  constructor() { }

  public add() {
    this.addEvent.emit(this.context);
  }

  ngOnInit() { }

}
