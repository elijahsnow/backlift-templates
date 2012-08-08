//  (c) 2012 Cole Krumbholz, SendSpree Inc.
//
//  This document may be used and distributed in accordance with 
//  the MIT license. You may obtain a copy of the license at 
//    http://www.opensource.org/licenses/mit-license.php

App.create_user = function(data, finished) {

  var user = new Backbone.Model(data);
  user.url = "/backlift/auth/currentuser"

  // fetch the user's followers
  App.followers = new App.Followers(null, {user: user});
  App.followers.fetch({
    // the __contains suffix doesn't do anything
    // right now. In the future it will limit
    // the query results. Now all results are
    // fetched regardless of user
    data: {"following__contains": user.id},
  });

  finished(user);
};
