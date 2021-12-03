import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'remove-button',
  templateUrl: './remove-button.component.html',
  styleUrls: ['./remove-button.component.scss'],
})
export class RemoveButtonsComponent implements OnInit {

  @Input() context
  @Input() size

  @Output() removeEvent = new EventEmitter<string>();

  constructor() { }

  public remove() {
    this.removeEvent.emit(this.context);
  }

  ngOnInit() { }

}
