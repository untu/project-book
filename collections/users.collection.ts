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

interface UsersCollection extends Mongo.Collection <User> {}

export var Users = <UsersCollection> Meteor.users;

Users.helpers({
    hasAccess: function(project: Project) {
        return this.profile.level == UserLevels.ADMIN || project.owner_id == this._id;
    },

    isAdmin: function () {
        return this.profile.level == UserLevels.ADMIN;
    }
});