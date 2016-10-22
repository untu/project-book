import * as _ from "lodash";
import {Users, UserLevels} from "../collections/users.collection";
declare var ServiceConfiguration; // Global var from service-configuration package.
var services = Meteor.settings['oauth'];

_.each(services, (params, name ) => {
  ServiceConfiguration.configurations.upsert({service: name}, {$set: params})
});

Accounts.onCreateUser(function (options, user) {
  if (user.services) {
    var service = _.keys(user.services)[0];
    var email = user.services[service].email;

    if (!email)
      return user;

    options.profile.email = email;

    switch (service) {
      case 'google':
        options.profile.picture = user.services.google.picture;
        break;
      case 'facebook':
        options.profile.picture = `http://graph.facebook.com/${user.services.facebook.id}/picture`;
        break;
    }

    options.profile.email = email;
    options.profile.level = UserLevels.USER;
    user.profile = options.profile;

    var existingUser = Users.findOne({'profile.email': email});
    if (!existingUser)
      return user;

    // precaution, these will exist from accounts-password if used
    if (!existingUser.services)
      existingUser.services = {resume: {loginTokens: []}};
    if (!existingUser.services.resume)
      existingUser.services.resume = {loginTokens: []};

    // copy across new service info
    existingUser.services[service] = user.services[service];
    if (user.services.resume) {
      existingUser.services.resume.loginTokens.push(
        user.services.resume.loginTokens[0]
      );
    }

    _.extend(existingUser.profile, options.profile);

    // even worse hackery
    Users.remove({_id: existingUser._id}); // remove existing record
    return existingUser;                          // record is re-inserted
  }
});