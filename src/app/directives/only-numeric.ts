import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({ 
     selector: '[onlyNumeric]' 
})
export class OnlyNumericDirective {
   constructor(private elRef: ElementRef) { }

   @HostListener('keydown', ['$event']) onKeyDown(event) {
    const e = <KeyboardEvent>event;
    if ([46, 8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
        ((e.keyCode === 65 || e.keyCode === 67 || e.keyCode === 88) && e.ctrlKey) ||
        (e.keyCode >= 35 && e.keyCode <= 39)) {
            return;
    }
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
   }
}