import {Directive, ElementRef, Input, Output, EventEmitter, ChangeDetectorRef} from "@angular/core";

declare var $:any;

@Directive({
    selector: '[input-toggle]',
})
export class InputToggleDirective {
    @Output() ngModelChange = new EventEmitter(false);
    @Input() ngModel: boolean;
    constructor(
        private ref:ElementRef,
        private cdr:ChangeDetectorRef
    ){}

    ngAfterViewInit() {
        var $el = $(this.ref.nativeElement);
        let disabled = $el.is(':disabled');

        $el.bootstrapToggle('enable')
           .bootstrapToggle(this.ngModel? 'on' : 'off')
           .change(()=>{
               this.ngModelChange.emit(!this.ngModel);
               this.cdr.detectChanges()
           });

        disabled && $el.bootstrapToggle('disable')
    }
}