import { Directive, ElementRef, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { GestureController, Platform } from '@ionic/angular';

@Directive({
  selector: '[drag]'
})
export class DragDirective {

  @Output() drag = new EventEmitter();
  @Input() elementRef

  constructor(
    private gestureCtrl: GestureController,
    private platform: Platform
  ) { }

  ngAfterViewInit() {
    console.log(this.elementRef.el);
    this.dragDelete();
  }

  public dragDelete() {
    //each time the number of accordions change all the gesture instances are recreated

    let dragGesture = this.gestureCtrl.create({
      el: this.elementRef.el,
      threshold: 20,
      direction: 'x',
      gestureName: 'drag',

      onMove: (ev) => {
        //translate horizonatally
        this.elementRef.el.style.transform = `translate(${ev.deltaX}px, 0)`;
      },

      onEnd: (ev) => {
        //if the accordion is abose half the page width it gets cancelled else it gers back to its position
        if (Math.abs(ev.deltaX) < this.platform.width() / 2) {
          this.elementRef.el.style.transform = `translate(0, 0)`;
        }
        else {
          this.drag.emit()
          this.elementRef.el.style.transform = `translate(0, 0)`;
        }
      },
    });

    dragGesture.enable();
  };
}


