import {Directive, ElementRef} from "@angular/core";

declare var $:any;

@Directive({
    selector: '[inputresize]',
})
export class InputResizeDirective {
    constructor(
        private ref: ElementRef
    ){}

    ngAfterViewInit(){
        $(this.ref.nativeElement).autosizeInput({space: 5});
    }
}