//  (c) 2012 Cole Krumbholz, SendSpree Inc.
//
//  This document may be used and distributed in accordance with 
//  the MIT license. You may obtain a copy of the license at 
//    http://www.opensource.org/licenses/mit-license.php


App.createUser = function () {  
  var UserModel = Backbone.Model.extend({
    urlRoot: "/backliftapp/users",
  });

  return new UserModel();
};


App.UserStatsView = Backbone.View.extend({
  initialize: function () {
    this.model.on("change", this.render, this);
  },

  render: function () {
    this.$el.html(JST.userstats(this.model.toJSON()));
    return this;
  },
});