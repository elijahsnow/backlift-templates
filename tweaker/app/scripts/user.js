//  (c) 2012 Cole Krumbholz, SendSpree Inc.
//
//  This document may be used and distributed in accordance with 
//  the MIT license. You may obtain a copy of the license at 
//    http://www.opensource.org/licenses/mit-license.php

App.UserModel = Backbone.Model.extend({
  urlRoot: '/backliftapp/users',
});

App.UserView = App.CommonView.extend({
  initialize: function(options, tweaksView) {
    // super.initialize()
    App.CommonView.prototype.initialize.call(this, options);

    this.tweaksView = tweaksView;

    // show errors generated when attempting to create new tweaks
    tweaksView.collection.on('error', function(status, response) {
      Backlift.handleFormErrors(this, response);
    }, this);
  },

  events: {
    'click #add-tweak': 'addTweak',
  },

  addTweak: function(e) {
    // creating an object. Certain values, such as the _created time and 
    // _owner are set by the server, so save() is used instead of create(),
    // and rather than listening for the .add event in tweaksView, we listen 
    // for the .change event which will be called after the server responds
    var newTweak = new Backbone.Model({message: $('#new-tweak').val()});
    this.tweaksView.collection.add(newTweak);
    newTweak.save();

    return false;
  },
});