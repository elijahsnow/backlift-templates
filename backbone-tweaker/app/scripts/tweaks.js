//  (c) 2012 Cole Krumbholz, SendSpree Inc.
//
//  This document may be used and distributed in accordance with 
//  the MIT license. You may obtain a copy of the license at 
//    http://www.opensource.org/licenses/mit-license.php

App = this.App || {};


App.Tweaks = Backbone.Collection.extend({
  url: '/backliftapp/tweaks',
});


// App.TweakListView: 
// renders a list of tweaks
App.TweakListView = Backlift.CommonView.extend({

  events: {
    'click .del': 'delTweak',
  },

  delTweak: function(ev) {
    var cid = $(ev.target).closest('.tweaker-item').attr('id').split('-')[1]; 
    var oldtweak = this.collection.get(cid);
    oldtweak.destroy();
    this.collection.remove(oldtweak);
  },

});


// App.TweakCountView: 
// renders the current user's total number of tweaks into a span
App.TweakCountView = Backbone.View.extend({

  tagName: "span",

  initialize: function() {
    this.collection.on('reset add remove', this.render, this);
  },

  render: function() {
    var total = this.collection.reduce(function (memo, item) {
      if (item.get("by") == Backlift.current_user.get("username"))
        return memo + 1;
      else
        return memo; 
    }, 0);
    this.$el.html(total);
    return this;
  },

});


// App.AddTweakView: 
// renders a simple form for adding tweaks that responds to errors
App.AddTweakView = Backlift.CommonView.extend({

  initialize: function(options) {
    // super.initialize()
    Backlift.CommonView.prototype.initialize.call(this, options);

    // show errors generated when attempting to create new tweaks
    this.collection.on('error', function(model, response) {
      model.collection.remove(model);
      Backlift.handleFormErrors(this, response);
    }, this);
  },

  events: {
    "click #add-tweak": "addTweak",
  },

  addTweak: function(e) {
    // Create a new Tweak. 
    var newTweak = new Backbone.Model({
      message: this.$("#new-tweak").val(),
      by: Backlift.current_user.get("username"),
    });
    this.collection.create(newTweak);

    Backlift.cleanupFormErrors(this);
    this.$("#new-tweak").val('');

    return false;
  },

});