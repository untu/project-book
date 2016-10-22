import {Directive, ElementRef} from "@angular/core";
import {Router} from "@angular/router";
import {ProjectService} from "../services/projects.service";

@Directive({
    selector: '[projectSearch]',
    host: {
        '(keyup)': 'search($event.target.value)'
    }
})
export class ProjectSearchDirective {
    constructor(
        private _router: Router,
        _projectService: ProjectService,
        _el: ElementRef
    ){
        _projectService.filter$.subscribe(filter => {
            _el.nativeElement.value = filter.text || '';
        })
    }

    search(value) {
        var params = value ? ['/search', value.replace('#', '%23')] : ['/list'];

        this._router.navigate(params)
    }
}