import {Directive, ElementRef} from "@angular/core";

declare var $:any;

@Directive({
    selector: '[textarearesize]',
})
export class TextareaResizeDirective {
    constructor(
        private ref: ElementRef
    ){}

    ngAfterViewInit(){
        $(this.ref.nativeElement).textareaAutoSize();
    }
}