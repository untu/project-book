import {Component, ChangeDetectorRef} from "@angular/core";
import {Router, ActivatedRoute, ROUTER_DIRECTIVES} from "@angular/router";
import {MeteorComponent} from "angular2-meteor";
import {Subscription, Observable} from "rxjs";
import * as _ from "lodash";
import {ProjectService, Projects} from "../../services/projects.service";
import {UserService} from "../../services/user.service";
import {InputResizeDirective} from "../../directives/input-resize.directive";
import {InputToggleDirective} from "../../directives/input-toggle.directive";
import {TextareaResizeDirective} from "../../directives/textarea-resize.directive";
import formTemplate from "./project-form.html";
import {User} from "../../../collections/users.collection";
import {Project} from "../../../collections/projects.collection";

@Component({
    selector: 'project-form',
    template: formTemplate,
    directives: [ROUTER_DIRECTIVES, InputResizeDirective, InputToggleDirective, TextareaResizeDirective]
})

export class ProjectFormComponent extends MeteorComponent {

    private project: Project;
    private user: User;
    private initSub: Subscription;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private projectService: ProjectService,
                private userService: UserService,
                private cdr:ChangeDetectorRef
    ) {
        super();
    };

    ngOnInit() {
        this.initSub = this.userService.currentUser$
            .map(user => {
                this.user = user;

                if (!user)
                    return this.router.navigate(['/']);
            })
            .switchMap(() => this.route.params)
            .switchMap(params => {
                if (params['id']) {
                    return this.projectService.get(params['id'])
                } else {
                    return Observable.of({
                        name: '',
                        cash: 10000000,
                        is_private: false,
                        tags: [],
                        description: '',
                        owner_id: this.user._id
                    })
                }
            })
            .map(project => {
                let user = this.user;

                if (!(project && user.hasAccess(project)))
                    return this.router.navigate(['/']);

                this.project = project;

                this.cdr.detectChanges();
                })
            .subscribe();
    }

    ngOnDestroy() {
        this.initSub.unsubscribe();
    }

    get cashStr ():string{
        return '' + this.project.cash;
    }
    set cashStr (val:string){
        this.project.cash = parseInt(val.replace(/\D/g,'')) || 0;
    }

    editTag(tagEl, i) {
        var tag = tagEl.value;

        if (_.isUndefined(i)) {
            tagEl.value = '';
            i = this.project.tags.length + 1;
        }

        tag = (tag[0] === '#' ? tag.slice(1) : tag).trim();

        tag.length ? this.project.tags.splice(i, 1, tag)
            : this.project.tags.splice(i, 1);

        return false;
    }

    save() {
        var id = Projects.save(this.project);
        this.router.navigate(['/project', id]);
    }
}