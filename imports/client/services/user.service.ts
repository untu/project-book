import {Injectable} from "@angular/core";
import {Observable, ReplaySubject} from "rxjs";
import {Users, User} from "../../collections/users.collection";
import {MeteorObservable} from "meteor-rxjs";
import * as _ from "lodash";

@Injectable()
export class UserService {
    currentUser$: Observable <User | null> = MeteorObservable.autorun()
        .map(()=> Meteor.user())
        .filter( user => !_.isUndefined(user))
        .zone();

    constructor() {
        MeteorObservable.subscribe('users').subscribe()
    }
}