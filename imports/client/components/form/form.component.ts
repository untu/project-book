import {Component, ChangeDetectorRef} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {Subscription, Observable} from "rxjs";
import * as _ from "lodash";

import {ProjectService, Projects} from "../../services/projects.service";
import {UserService} from "../../services/user.service";
import template from "./form.html";
import {User} from "../../../collections/users.collection";
import {Project} from "../../../collections/projects.collection";
import {AbstractComponent} from "../helpers/abstract.component";

@Component({
    selector: 'project-form',
    template
})

export class FormComponent extends AbstractComponent {

    private project: Project;
    private user: User;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private projectService: ProjectService,
                private userService: UserService,
                private cdr:ChangeDetectorRef
    ) { super() };

    ngOnInit() {
        let sub = this.userService.currentUser$
            .filter(user => {
                this.user = user;

                if (!user)
                    this.router.navigate(['/']);

                return !!user;
            })
            .switchMap(() => this.route.params)
            .switchMap(params => {
                if (params['id']) {
                    return this.projectService.getById(params['id'])
                } else {
                    return Observable.of( <Project> {
                        name: '',
                        tags: [],
                        description: '',
                        owner_id: this.user._id,
                        cash: 10000000
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

        this.sub(sub)
    }

    get cashStr ():string{
        return '' + (this.project.cash || 0);
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
        Projects.save(this.project).subscribe((id) =>
            this.router.navigate(['/project', id]),
            console.log
        );
        return false;
    }
}