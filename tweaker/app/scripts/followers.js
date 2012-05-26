//  (c) 2012 Cole Krumbholz, SendSpree Inc.
//
//  This document may be used and distributed in accordance with 
//  the MIT license. You may obtain a copy of the license at 
//    http://www.opensource.org/licenses/mit-license.php

App.Followers = Backbone.Collection.extend({
  url: '/backliftapp/users',
});

App.NumFollowersView = Backbone.View.extend({

  tagName: "span",

  initialize: function() {
    this.collection.on('reset', this.render, this);
  },

  // render: just renders the number of the current
  // user's followers
  render: function() {
    var followers = this.collection.filter(function (item) {
      return _.indexOf(item.get('following'),
                       $.cookie('user')) >= 0;
    });
    this.$el.html(followers.length.toString());
    return this;
  },

});