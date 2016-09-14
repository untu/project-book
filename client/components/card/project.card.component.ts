import {Component, ChangeDetectorRef} from "@angular/core";
import {Router, ActivatedRoute, ROUTER_DIRECTIVES} from "@angular/router";
import {ProjectService} from "../../services/projects.service";
import {UserService} from "../../services/user.service";
import templateCardHtml from "./project-card.html";
import {InputToggleDirective} from "../../directives/input-toggle.directive";
import {ProjectCommonComponent} from "../../imports/project.common.component";
import {Project} from "../../../collections/projects.collection";
declare var FB;

enum ViewMode {
    LOADING,
    DENY,
    BRIEF,
    FULL
}

@Component({
    selector: 'project-card',
    template: templateCardHtml,
    directives: [ROUTER_DIRECTIVES, InputToggleDirective]
})
export class ProjectCardComponent extends ProjectCommonComponent {
    private project: Project;
    private hasEdit: boolean = false;
    private viewMode: ViewMode;
    private ViewMode = ViewMode;
    private description: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private projectService: ProjectService,
        private userService: UserService,
        private cdr:ChangeDetectorRef
    ) { super() };

    ngOnInit() {
        let project$ = this.route.params
            .switchMap(params => this.projectService.get(params['id']));

        let sub = project$.combineLatest(
            this.userService.currentUser$,
            (project, user) => {
                if (!project)
                    return this.router.navigate(['/']);

                this.project = project;
                this.projectService.currentProject$.next(this.project);

                this.hasEdit = !!user && user.hasAccess(project);
                this.viewMode = this.changeView(project, user);
                this.description = this.makeDescription(project.description, !user);

                this.cdr.detectChanges();

                this.faceBookParse();
        }).subscribe();
        this.sub(sub);

        setTimeout(()=> { // BUG If Projects collection empty, projectService.get silent.
            if (!this.viewMode) {
                this.viewMode = ViewMode.DENY
            }
        }, 2000);
    }

    faceBookParse() {
        FB.XFBML.parse()
    }

    private get href() {
        return location.href;
    }

    private changeView(project, user){
        if (!project) return ViewMode.DENY;

        if (user) return ViewMode.FULL;

        return ViewMode.BRIEF;
    }
}