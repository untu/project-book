import {Users, UserLevels} from "../collections/users.collection";
import {Projects} from "../collections/projects.collection";
import {Tags} from "../collections/tags.collection";
import * as _ from "lodash";

let MigrationSchema = new SimpleSchema({
  key: {
    type: String
  },
  created_at: {
    type: Date,
    autoValue: function (): Date | Object {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();
      }
    }
  }
});

interface Migration {
  key: string,
  created_at?: Date
}

class MigrationsCollection extends Mongo.Collection <Migration> {
}

export var Migrations = new MigrationsCollection('migrations');
Migrations.attachSchema(MigrationSchema);

var rules = {
  'first-migration': function () {
    var user = Users.findOne({'profile.level': UserLevels.ADMIN});
    let adminId;

    if (!user) {
      user = {
        profile: {
          name: 'admin',
          email: 'admin@admin.ru',
          level: UserLevels.ADMIN
        }
      };
      adminId = Users.insert(user);
    }
    else {
      adminId = user._id;
    }
  },

  're-count-tags': function () {
    Tags.collection.remove({});

    Projects.collection.find({})
      .forEach(project => {
        _.each(project.tags, (tag: string) => Tags.inc(tag));
      })
  },
  'reset-rating': function () {
    Projects.update({}, {
      '$set': {
        rating: {
          list: {},
          average: 0,
          count: 0
        },
      }
    }, {multi: true});
  }
};

Meteor.startup(() => {
  let migrations = Migrations.find({}, {fields: {key: 1}}).map((m) => m.key);
  let needMigrate = _.difference(_.keys(rules), migrations);
  _.each(needMigrate, (key)=> {
    rules[key]();
    Migrations.insert({key: key});
    console.log(`Migration "${key}" done`);
  });
});