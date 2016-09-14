import {Component, ChangeDetectorRef} from "@angular/core";
import {FORM_DIRECTIVES} from "@angular/forms";
import {Observable} from "rxjs";
import {ROUTER_DIRECTIVES, ActivatedRoute} from "@angular/router";
import {MeteorComponent, MeteorObservable} from "angular2-meteor";
import {LocalStorage} from "../directives/local-storage";
import {Tags, Tag} from "../../collections/tags.collection";
import {ProjectSearchDirective} from "../directives/project-search.directive";
import {ProjectService} from "../services/projects.service";
import {UserService} from "../services/user.service";
import template from "./layout.html";
import {User} from "../../collections/users.collection";

@Component({
    selector: 'app',
    template,
    directives: [ROUTER_DIRECTIVES, ProjectSearchDirective, FORM_DIRECTIVES]
})
export class ProjectComponent extends MeteorComponent {
    private user: User = null;
    private popularTags$: Observable <Tag[]>;
    private blinkLoginForm: boolean;

    constructor(
        private projectService: ProjectService,
        private route: ActivatedRoute,
        private _localStorage: LocalStorage,
        private userService: UserService,
        private cdr:ChangeDetectorRef
    ){
        super();

        MeteorObservable.subscribe('tags').subscribe();

        this.popularTags$ = this.popularTags();
    }

    ngOnInit() {
        let user$ = this.userService.currentUser$
            .do(user => this.user = user);

        this.projectService.currentProject$
            .combineLatest(
                user$,
                (project, user) => {
                    if (!user && project) {
                        this.blinkLoginForm = true;
                        setTimeout(()=> this.blinkLoginForm = false, 2000);
                    }

                    this.cdr.detectChanges();
                }
            )
            .subscribe()
    }

    get isGridView() {
        return this._localStorage.get('isGridView');
    }

    set isGridView(val: boolean) {
        this._localStorage.set('isGridView', val);
    }

    login(serviceName) {
        switch (serviceName){
            case 'fb':
                Meteor.loginWithFacebook({requestPermissions: ['public_profile, email']});
                break;
            case 'google':
                Meteor.loginWithGoogle({requestPermissions: ['https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile']});
                break;
        }

        return false;
    }

    logout() {
        Meteor.logout();

        return false;
    }

    private popularTags(): Observable <Tag[]> {
        var query = {
            count: {$gt: 0}
        };

        var options = {
            sort: {count: -1}
        };

        return Tags.find(query, options).map(tags => tags.slice(0, 7)).share();
    }
}