import {Component} from "@angular/core";
import {Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {MeteorObservable} from "meteor-rxjs";
import {LocalStorage} from "../services/local-storage.service";
import {Tags, Tag} from "../../collections/tags.collection";
import {ProjectService} from "../services/projects.service";
import {UserService} from "../services/user.service";
import template from "./app.html";
import {User} from "../../collections/users.collection";

@Component({
  selector: 'app',
  template
})
export class AppComponent {
  private popularTags$: Observable <Tag[]>;
  private blinkLoginForm: boolean;
  private user$: Observable <User> = this.userService.currentUser$;
  private user: User;

  constructor(private projectService: ProjectService,
              private route: ActivatedRoute,
              private _localStorage: LocalStorage,
              private userService: UserService,) {
  }

  ngOnInit() {
    this.user$.subscribe(user => this.user = user);

    MeteorObservable.subscribe('tags').subscribe();
    this.popularTags$ = this.popularTags();
  }

  get isGridView() {
    return this._localStorage.get('isGridView');
  }

  set isGridView(val: boolean) {
    this._localStorage.set('isGridView', val);
  }

  login = UserService.login;

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

    return Tags.find(query, options).map(tags => tags.slice(0, 7)).zone();
  }
}