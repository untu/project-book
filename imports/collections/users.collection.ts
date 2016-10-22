import {MongoObservable} from 'meteor-rxjs';
import {Project} from "./projects.collection";

export interface User extends Meteor.User {
    hasAccess? (project: Project)
    isAdmin? (): boolean;
}

export enum UserLevels {
    GUEST,
    USER,
    ADMIN
}

export var Users = MongoObservable.fromExisting <User> (Meteor.users);

Users.collection.helpers({
    hasAccess: function(project: Project) {
        return this.profile.level == UserLevels.ADMIN || project.owner_id == this._id;
    },

    isAdmin: function () {
        return this.profile.level == UserLevels.ADMIN;
    }
});