//  (c) 2012 Cole Krumbholz, SendSpree Inc.
//
//  This document may be used and distributed in accordance with 
//  the MIT license. You may obtain a copy of the license at 
//    http://www.opensource.org/licenses/mit-license.php

App.Tweaks = Backbone.Collection.extend({
  url: '/backliftapp/tweaks',
});


// App.TweakListView: 
// renders a list of tweaks
App.TweakListView = App.CommonView.extend({

  events: {
    'click .del': 'delTweak',
  },

  delTweak: function(ev) {
    var cid = $(ev.target).closest('.tweaker-item').attr('id').split('-')[1]; 
    var oldtweak = this.collection.getByCid(cid);
    oldtweak.destroy();
    this.collection.remove(oldtweak);
  },

});


// App.TweakCountView: 
// renders the current user's total number of tweaks into a span
App.TweakCountView = Backbone.View.extend({

  tagName: "span",

  initialize: function() {
    // Rather than listening for the add event, we listen for the 
    // sync event which will be triggered after the server responds
    // to a save() with the 'real' (server-generated) tweak object.
    // This way we catch attributes set by the server such as 
    // the _owner attribute which we need to render this view.
    this.collection.on('sync reset remove', this.render, this);
  },

  render: function() {
    var total = this.collection.reduce(function (memo, item) {
      if (item.get('_owner') == $.cookie('userid'))
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
App.AddTweakView = App.CommonView.extend({

  initialize: function(options) {
    // super.initialize()
    App.CommonView.prototype.initialize.call(this, options);

    // show errors generated when attempting to create new tweaks
    this.collection.on('error', function(status, response) {
      Backlift.handleFormErrors(this, response);
    }, this);
  },

  events: {
    'click #add-tweak': 'addTweak',
  },

  addTweak: function(e) {
    Backlift.cleanupFormErrors(this);

    // Create a new Tweak. 
    var newTweak = new Backbone.Model({
      message: this.$('#new-tweak').val(),
      by: $.cookie('username'),
    });
    this.collection.add(newTweak);
    newTweak.save();
    return false;
  },

});