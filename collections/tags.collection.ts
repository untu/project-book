import {MongoObservable} from "angular2-meteor";

export interface Tag {
    _id?: string;
    key: string;
    count: number;
}

class TagsCollection extends MongoObservable.Collection <Tag> {
    inc(tag: string, inc: number = 1) {
        if (Meteor.isServer) {
            this.update({key: tag}, {$inc: {count: inc}}, {upsert: true});
        }
    }
}

export var Tags = new TagsCollection('tags');

Tags.allow({
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
