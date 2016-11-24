import {Component, ElementRef, OnInit} from "@angular/core";

declare let FB;

@Component({
  selector: 'fb-comments',
  template: `
    <div *ngIf="!fbLoaded" style="position: absolute; margin: 10px 10px" class="loader"></div>
    <div [hidden]="!fbLoaded" class="fb-comments" [attr.data-href]="href" data-width="100%" data-numposts="5"></div>
    `
})
export class FbCommentsComponent implements OnInit {
  private fbLoaded: Boolean = false;

  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    FB.Event.subscribe('xfbml.render', () => {
      this.fbLoaded = true
    });

    FB.XFBML.parse(this.el.nativeElement);
  }

  private get href() {
    return location.href;
  }
}