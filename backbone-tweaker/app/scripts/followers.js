//  (c) 2012 Cole Krumbholz, SendSpree Inc.
//
//  This document may be used and distributed in accordance with 
//  the MIT license. You may obtain a copy of the license at 
//    http://www.opensource.org/licenses/mit-license.php

App = this.App || {};


App.Followers = Backbone.Collection.extend({

  url: "/backliftapp/profiles",

  initialize: function(models, options) {
    if (options.user) {
      this.user = options.user;
    }
  },

  // followers() returns the list of users
  // that follow the currently logged in user.
  followers: function() {
    var result = (!this.models) ? [] : this.models.map(function (item) {
      return _.indexOf(item.get("following"), this.user.get("username")) >= 0 
             ? item.get("username") : null;
    }, this);
    return _.filter(result, function (item) { return item !== null; });
  },

});


App.NumFollowersView = Backbone.View.extend({

  tagName: "span",

  initialize: function() {
    this.collection.on("reset", this.render, this);
  },

  // render: just renders the number of the current
  // user's followers
  render: function() {
    this.$el.html(this.collection.followers().length.toString());
    return this;
  },

});


App.NumFollowingView = Backbone.View.extend({

  tagName: "span",

  initialize: function() {
    // change is triggered when a new user is fetched
    // sync is triggered when new user data is saved
    this.model.on('change:id sync', this.render, this);
  },

  render: function() {
    this.$el.html(this.model.get('profile').following.length.toString());
    return this;
  },

});


App.FollowingView = Backbone.View.extend({

  initialize: function(options, userModel) {
    this.userModel = userModel;
  },

  _following: function() {
    return this.userModel.get("profile").following;
  },

  _saveFollowing: function(following) {
    var profile = this.userModel.get("profile");
    profile.following = following;
    this.userModel.save({profile: profile});
    this.render();
  },

  _renderUsers: function (users, addfollowers) {
    this.$el.html(JST.followers({
      filter: this._following(),
      users: users,
      addfollowers: addfollowers,
    }));
    return this;    
  },

  render: function() {
    return this._renderUsers(this._following(), true);
  },

  events: {
    'mouseover .follower': function (ev) {
      $(ev.target).removeClass('btn-success');
      $(ev.target).addClass('btn-danger');
      $(ev.target).html('unfollow');
    },
    'mouseout .follower': function (ev) {
      $(ev.target).removeClass('btn-danger');
      $(ev.target).addClass('btn-success');
      $(ev.target).html('following');
    },
    'click [id^="follow-"]': function (ev) {
      var userid = $(ev.target).attr('id').split('-')[1];
      this._add_follower(userid);
    },
    'click [id^="unfollow-"]': function (ev) {
      var userid = $(ev.target).attr('id').split('-')[1];
      this._del_follower(userid);
    },
    'click #add-follower': function (ev) {
      var userid = this.$('#new-follower').val();
      this._add_follower(userid);
      return false;
    },
  },

  _add_follower: function(userid) {
      var following = this._following();
      if (_.indexOf(following, userid) == -1)
        following.push(userid);
      this._saveFollowing(following);
  },

  _del_follower: function(userid) {
      var following = this._following();
      following = _.filter(following, function (item) {
        return item !== userid;
      });
      this._saveFollowing(following);
  },
});


App.FollowersView = App.FollowingView.extend({

  initialize: function(options, userModel) {
    this.userModel = userModel;
    this.userModel.on('change:id', this.render, this);
    this.collection.on('reset', this.render, this);
  },

  render: function() {
    return this._renderUsers(this.collection.followers(), false);
  },

});