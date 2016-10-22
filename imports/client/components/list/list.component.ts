import {Component, ChangeDetectorRef} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Subscription, Observable} from "rxjs";
import {ProjectService} from "../../services/projects.service";
import {LocalStorage} from "../../services/local-storage.service";
import template from "./list.html";
import {Project} from "../../../collections/projects.collection";

@Component({
    selector: 'project-list',
    template
})
export class ListComponent {
    projects$: Observable<Project[]>;

    constructor(
        private projectService: ProjectService,
        private _route: ActivatedRoute,
        private _localStorage: LocalStorage,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.projectService.currentProject = null;

        this.projects$ = this._route.params
            .flatMap(params => {
                let searchText = params['search'];

                if (searchText)
                    searchText = decodeURI(searchText.replace('%23', '#'));

                return this.projectService.search({text: searchText}, {sort: {'rating.count': -1, 'rating.average': -1, created_at: -1}}).zone();
            })
    }

    get isGridView(){
     return this._localStorage.get('isGridView');
    }

    set isGridView(val) {
        this._localStorage.set('isGridView', val);
    }
}
