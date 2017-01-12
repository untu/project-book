import {Injectable} from "@angular/core";
import {ReplaySubject} from "rxjs";
import {User} from "../../collections/users.collection";
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

  static login(serviceName) {
    switch (serviceName) {
      case 'fb':
        Meteor.loginWithFacebook({requestPermissions: ['public_profile, email']});
        break;
      case 'google':
        Meteor.loginWithGoogle({requestPermissions: ['https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile']});
        break;
    }

    return false;
  }
}