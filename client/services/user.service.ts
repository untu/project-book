import {Injectable} from "@angular/core";
import {Observable, ReplaySubject} from "rxjs";
import {MeteorComponent, toObservable, MeteorObservable} from "angular2-meteor";
import {Users, User} from "../../collections/users.collection";

@Injectable()
export class UserService extends MeteorComponent {
    currentUser$ = new ReplaySubject <User | null>(1);
    logined$ = new ReplaySubject <string | null>(1);

    constructor() {
        super();

        MeteorObservable.subscribe('users').subscribe();

        this.autorun(() => {
            this.logined$.next(Meteor.userId());
        });

        this.logined$
            .switchMap(userId => userId ?
                toObservable(Users.find({_id: userId})).map(users => users[0]) : Observable.of(null)
            )
            .subscribe(user => this.currentUser$.next(user))
    }
}