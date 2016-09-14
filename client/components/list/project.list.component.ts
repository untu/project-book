import {Component, ChangeDetectorRef} from "@angular/core";
import {Router, ActivatedRoute, ROUTER_DIRECTIVES} from "@angular/router";
import {Subscription} from "rxjs";
import {ProjectService} from "../../services/projects.service";
import {LocalStorage} from "../../directives/local-storage";
import {ProjectItemComponent} from "./project.item.component";
import projectListHtml from "./project-list.html";
import {Project} from "../../../collections/projects.collection";

@Component({
    selector: 'project-list',
    template: projectListHtml,
    directives: [ROUTER_DIRECTIVES, ProjectItemComponent]
})
export class ProjectListComponent {
    projects: Project[];
    projectsSub: Subscription;

    constructor(
        private projectService: ProjectService,
        private _route: ActivatedRoute,
        private _localStorage: LocalStorage,
        private _router: Router,
        private cdr:ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.projectsSub = this._route.params
            .flatMap(params => {
                let searchText = params['search'];
                if (searchText)
                    searchText = decodeURI(searchText.replace('%23', '#'));

                return this.projectService.search({text: searchText}, {sort: {created_at: -1}})
            }).subscribe(projects => {
                this.projects = projects;

                this.projectService.currentProject$.next(null);

                this.cdr.detectChanges();
            });
    }

    get isGridView() {
     return this._localStorage.get('isGridView');
    }

    set isGridView(val: boolean) {
        this._localStorage.set('isGridView', val);
    }

    ngOnDestroy() {
        this.projectsSub.unsubscribe()
    }
}
