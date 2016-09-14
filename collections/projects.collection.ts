import {ObservableCursor, MongoObservable, toObservable} from "angular2-meteor";
import * as _ from "lodash";
import {Observable} from "rxjs";

import {Tags, Tag} from "./tags.collection";
import {Users, User} from "./users.collection";

export interface ProjectsFilter {
    text: string
}

export interface Project {
    _id?: string;
    name: string;
    cash: number;
    is_private: boolean;
    tags: Array<string>;
    owner_id: string
    created_at?: Date;
    updated_at?: Date
    description: string;
    owner?(): Observable<User>;
}

let ProjectSchema = new SimpleSchema({
    name: {
        type: String
    },
    cash: {
        type: Number
    },
    is_private: {
        type: Boolean,
        defaultValue: false
    },
    owner_id: {
        type: String
    },
    tags: {
        type: Array,
        defaultValue: []
    },
    'tags.$': {
        type: String
    },
    created_at: {
        type: Date,
        autoValue: function() : Date | Object{
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date()};
            }
        }
    },
    updated_at: {
        type: Date,
        autoValue: function() {
            if (this.isUpdate) {
                return new Date();
            }
        },
        denyInsert: true,
        optional: true
    },
    description: {
        type: String
    }
});

class ProjectsCollection extends MongoObservable.Collection <Project> {
    search(filter: ProjectsFilter, options?: Object): ObservableCursor <Project[]> {
    let query: Mongo.Selector;
    query = filter.text ? {
        $or: [
            { name: { $regex: filter.text, $options: 'i' } },
            { description: { $regex: filter.text, $options: 'i'} },
            { tags: { $in: filter.text.split('#').map((item) => item.trim())} }
        ]
    } : {};

    return this.find(query, options);
    }

    save(project: Project): string {
        var id = project._id;

        if (!id) {
            return this.insert(project);
        }
        else {
            var update = _.omit(project, '_id');
            this.update({_id: id}, {$set: update});
            return id;
        }
    }
}

export var Projects = new ProjectsCollection('projects');
var ProjectsCollectionHelpers = Projects.getMongoCollection();
ProjectsCollectionHelpers.attachSchema(ProjectSchema);

// Helpers
ProjectsCollectionHelpers.helpers({
    owner: function(project: Project): Observable<User> {
        return toObservable(Users.find({_id: this.owner_id})).map(users => users[0])
    }
});

// Hooks.
ProjectsCollectionHelpers.before.insert((userId, project:Project) => {
    _.each(project.tags, (tag) => Tags.inc(tag));
});

ProjectsCollectionHelpers.before.update((userId, project: Project, fieldNames, modifier: Project, options) => {
    let newTags = modifier['$set'].tags;
    var added = _.difference(newTags, project.tags);
    _.each(added, (tag) => Tags.inc(tag));
    var removed = _.difference(project.tags, newTags);
    _.each(removed, (tag) => Tags.inc(tag, -1));
});

ProjectsCollectionHelpers.before.remove((userId, project: Project) => {
    _.each(project.tags, (tag) => Tags.inc(tag, -1));
});

// Permissions.
Projects.allow({
    insert: function() {
        let user = Meteor.user();

        return !!user;
    },
    update: function() {
        let user = Meteor.user();

        return !!user;
    },
    remove: function() {
        let user = Meteor.user();

        return !!user;
    }
});