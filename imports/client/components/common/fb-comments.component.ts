import {Component, ElementRef} from "@angular/core"

declare var FB;

@Component({
    selector: 'fb-comments',
    template: `<div class="fb-comments" [attr.data-href]="href" data-width="100%" data-numposts="5"></div>`
})
export class FbCommentsComponent {
    constructor(
        private el: ElementRef
    ){}

    ngOnInit(){
        FB.XFBML.parse(this.el.nativeElement)
    }

    private get href() {
        return location.href;
    }

}