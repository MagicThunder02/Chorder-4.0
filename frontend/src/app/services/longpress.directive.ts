import { Directive, ElementRef, EventEmitter, Input, NgZone, Output } from '@angular/core';
import { GestureController } from '@ionic/angular';

@Directive({
  selector: '[longpress]'
})
export class LongpressDirective {

  @Output() press = new EventEmitter();
  @Input("delay") delay = 100;
  waitTime = 1000
  isActive = false
  action: any;

  constructor(
    private el: ElementRef,
    private gestureCtrl: GestureController,
  ) { }

  ngAfterViewInit() {
    this.loadLongPressOnElement();
  }

  loadLongPressOnElement() {
    const gesture = this.gestureCtrl.create({
      el: this.el.nativeElement,
      threshold: 0,
      gestureName: 'longpress',
      onStart: ev => {

        this.isActive = true;

        //aspetta 500ms (waitTime)
        setTimeout(() => {

          //se alla fine dei 500ms sta ancora premendo allora inizia a mandare l'evento ogni delay
          if (this.isActive) {
            this.action = setInterval(() => {
              this.press.emit();
            }, this.delay);
          }

        }, this.waitTime);

      },
      //quando si rilascia smette dimandare l'evento
      onEnd: ev => {
        this.isActive = false;

        clearInterval(this.action);
      }
    });
    gesture.enable(true);
  }

}
