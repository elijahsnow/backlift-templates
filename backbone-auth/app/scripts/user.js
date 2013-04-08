//  (c) 2012 Cole Krumbholz, SendSpree Inc.
//
//  This document may be used and distributed in accordance with 
//  the MIT license. You may obtain a copy of the license at 
//    http://www.opensource.org/licenses/mit-license.php

App = this.App || {};

App.UserStatsView = Backbone.View.extend({
  initialize: function () {
    this.model.on("change:id", this.render, this);
  },

  render: function () {
    this.$el.html(Handlebars.templates.userstats(this.model.toJSON()));
    return this;
  },
});


Handlebars.registerHelper('date', function(date) {
  return new Date(date).toString('MMMM d, yyyy hh:mm:ss');
});