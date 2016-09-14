import {Projects} from "../collections/projects.collection";
import {Users} from "../collections/users.collection";
import {Tags} from "../collections/tags.collection";

Meteor.publish('projects', function() {

    var user = Users.findOne(this.userId);

    if (!user)
        return Projects.getMongoCollection().find({is_private: false}, {fields: {
            name: 1,
            owner_id:1,
            description: 1,
            tags: 1
        }});

    if (user.isAdmin()) {
        return Projects.getMongoCollection().find();
    }
    else {
        return Projects.getMongoCollection().find({$or: [{is_private: false}, {owner_id: this.userId}]});
    }
});

Meteor.publish('tags', function() {
    return Tags.getMongoCollection().find({});
});

Meteor.publish('users', function() {
    return Users.find({}, {fields: {profile: 1}});
});