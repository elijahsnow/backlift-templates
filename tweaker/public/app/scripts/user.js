//  (c) 2012 Cole Krumbholz, SendSpree Inc.
//
//  This document may be used and distributed in accordance with 
//  the MIT license. You may obtain a copy of the license at 
//    http://www.opensource.org/licenses/mit-license.php

App.UserModel = Backbone.Model.extend({
  urlRoot: '/backliftapp/users',
});


App.create_user = function() {

  var user = new App.UserModel({
    following: [],
    name: $.cookie('username'),
  });

  App.followers = new App.Followers();

  user.on('change', function(userModel) {
    App.followers.fetch({
      // the __contains suffix doesn't do anything
      // right now. In the future it will limit
      // the query results. Now all results are
      // fetched regardless of user
      data: {'following__contains': userModel.id},
    });
  });

  return user;
};
