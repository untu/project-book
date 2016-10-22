import {Component} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {ProjectService} from "../../services/projects.service";
import {UserService} from "../../services/user.service";
import template from "./card.html";
import {AbstractComponent} from "../helpers/abstract.component";
import {Project} from "../../../collections/projects.collection";
import {User} from "../../../collections/users.collection";

enum ViewMode {
  LOADING = 1,
  DENY = 2,
  BRIEF = 3,
  FULL = 4
}

@Component({
  selector: 'project-card',
  template
})
export class CardComponent extends AbstractComponent {
  private project: Project;
  private hasEdit: boolean = false;
  private viewMode: ViewMode = ViewMode.LOADING;
  private ViewMode = ViewMode;
  private description: string;
  private user: User;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private projectService: ProjectService,
              private userService: UserService) {
    super()
  };

  ngOnInit() {
    let sub = this.route.params
      .switchMap(params => this.projectService.getById(params['id']).zone())
      .do(project => this.projectService.currentProject = this.project = project)
      .combineLatest(this.userService.currentUser$,
        (project: Project, user: User) => {
          this.viewMode = !project ? ViewMode.DENY : !user ? ViewMode.BRIEF : ViewMode.FULL;
          this.hasEdit = !!user && user.hasAccess(project);
          this.user = user;
          this.description = this.makeDescription(project.description, !user);
        })
      .subscribe();

    setTimeout(()=> { // If project not found getById silent.
      this.viewMode == ViewMode.LOADING && (this.viewMode = ViewMode.DENY);
    }, 3000);

    this.sub(sub);
  }
}