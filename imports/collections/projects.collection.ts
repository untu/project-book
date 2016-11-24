import {ObservableCursor, MongoObservable} from "meteor-rxjs";
import * as _ from "lodash";
import {Observable} from "rxjs";
import {Tags} from "./tags.collection";
import {Users, User} from "./users.collection";
import Cursor = Mongo.Cursor;

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
  rating: {
    list: Object, // {userId: rating}
    average: number,
    count: number
  }
  owner?(): Observable<User>;
  rate?(vote: number, userId: string): Observable<User>;
}

let ProjectSchema = new SimpleSchema({
  name: {
    type: String
  },
  cash: {
    type: Number,
    defaultValue: 10000000
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
    autoValue: function (): Date | Object {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      }
    }
  },
  updated_at: {
    type: Date,
    autoValue: function () {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true
  },
  description: {
    type: String
  },
  rating: {
    type: Object,
    defaultValue: {}
  },
  'rating.list': {
    type: Object,
    blackbox: true,
    defaultValue: {}
  },
  'rating.average': {
    type: Number,
    defaultValue: 0
  },
  'rating.count': {
    type: Number,
    defaultValue: 0
  }
});

class ProjectCollection extends MongoObservable.Collection <Project> {
  search(filter: ProjectsFilter, options?: Object): ObservableCursor<Project> {
    let query: Mongo.Selector;
    query = filter.text ? {
      $or: [
        {name: {$regex: filter.text, $options: 'i'}},
        {description: {$regex: filter.text, $options: 'i'}},
        {tags: {$in: filter.text.split('#').map((item) => item.trim())}}
      ]
    } : {};

    return this.find(query, options);
  }

  save(project: Project): Observable<string> {
    let id = project._id;

    if (!id) {
      return this.insert(project);
    }
    else {
      let update = _.omit(project, '_id');
      this.update({_id: id}, {$set: update});
      return Observable.of(id);
    }
  }
}

export const Projects = new ProjectCollection('projects');

Projects.collection.attachSchema(ProjectSchema);

// Helpers
Projects.collection.helpers({
  owner: function (): Observable<User> {
    return Users.find({_id: this.owner_id})
      .map(_.first)
  },

  rate: function (userVote: number, userId: string): Observable<number> {
    this.rating.list[userId] = userVote;
    this.rating.count = 0;
    let valSum = 0;

    _.each(this.rating.list, (val: number) => {
      this.rating.count++;
      valSum += val;
    });

    this.rating.average = (valSum / this.rating.count) | 0;

    return Projects.update({_id: this._id}, {$set: {rating: this.rating}});
  }
});

// Hooks.
if (Meteor.isServer) {
  Projects.collection.before.insert((userId, project: Project) => {
    _.each(project.tags, (tag) => Tags.inc(tag));
  });

  Projects.collection.before.update((userId, project: Project, fieldNames, modifier: Project) => {
    if (modifier['$set'] && modifier['$set'].tags) {
      let newTags = modifier['$set'].tags;
      let added = _.difference(newTags, project.tags);
      _.each(added, (tag) => Tags.inc(tag));
      let removed = _.difference(project.tags, newTags);
      _.each(removed, (tag) => Tags.inc(tag, -1));
    }
  });

  Projects.collection.before.remove((userId, project: Project) => {
    _.each(project.tags, (tag) => Tags.inc(tag, -1));
  });
}

// Permissions.
Projects.allow({
  insert: function () {
    let user = Meteor.user();

    return !!user;
  },
  update: function (userId, project: Project, changeFields: [string]) {
    let user = <User> Meteor.user();

    if (!user) {
      return false;
    }

    if (_.isEqual(changeFields, ['rating', 'updated_at'])) { // Only rating.
      return true;
    }

    return user.hasAccess(project);
  },
  remove: function (userId, project: Project) {
    let user = <User> Meteor.user();

    return !!user && user.hasAccess(project);
  }
});