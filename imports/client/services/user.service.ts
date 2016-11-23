import {Injectable} from "@angular/core";
import {Observable, ReplaySubject} from "rxjs";
import {Users, User} from "../../collections/users.collection";
import {MeteorObservable} from "meteor-rxjs";
import * as _ from "lodash";

@Injectable()
export class UserService {
  currentUser$: ReplaySubject <User | null> = new ReplaySubject(1);

  constructor() {
    MeteorObservable.subscribe('users').subscribe();

    MeteorObservable.autorun()
      .subscribe(() => {
        const user = Meteor.user();

        if (_.isUndefined(user)) {
          return;
        }

        this.currentUser$.next(user);
      });
  }
}