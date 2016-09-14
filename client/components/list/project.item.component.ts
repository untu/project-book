import {Component, Input} from "@angular/core";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {ProjectCommonComponent} from "../../imports/project.common.component";
import {User} from "../../../collections/users.collection";
import {Project} from "../../../collections/projects.collection";

@Component({
    selector: 'project-item',
    template: `
    <div class="project">
        <div class="panel panel-info" (click)="router.navigate(['project', project._id])">
            <div class="panel-heading text-center">
                <div class="row">
                  <div class="col-md-10 project-name">
                      <span class="lead">{{project.name}}</span>
                  </div>
                  <div class="col-md-2">
                      <div class="user-logo">
                          <img src="{{owner?.profile.picture}}">
                      </div>
                  </div>
                </div>
            </div>
            <div class="panel-body">
                <p class="description">{{description}}</p>
            </div>
            <div class="panel-footer" *ngIf="project.tags && project.tags.length > 0">
                <ul class="list-inline tags">
                    <li *ngFor="let tag of project.tags">
                        <a [routerLink]="['/search', '#' + tag]" (click)="$event.stopPropagation()">#{{tag}}</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>  
`,
})
export class ProjectItemComponent extends ProjectCommonComponent {
    @Input() project: Project;
    private owner: User;
    private description: string;

    constructor(private userService: UserService,
                private router: Router) {
        super()
    }

    ngOnInit() {
        var ownerSub = this.project.owner()
            .subscribe( owner => this.owner = owner);
        this.sub(ownerSub);

        var currentUserSub = this.userService.currentUser$
            .subscribe(user => this.description = this.makeDescription(this.project.description, !user));
        this.sub(currentUserSub);
    }
}
