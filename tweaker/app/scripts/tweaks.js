//  (c) 2012 Cole Krumbholz, SendSpree Inc.
//
//  This document may be used and distributed in accordance with 
//  the MIT license. You may obtain a copy of the license at 
//    http://www.opensource.org/licenses/mit-license.php

App.Tweaks = Backbone.Collection.extend({
  url: '/backliftapp/tweaks',
});

App.TweakListView = App.CommonView.extend({
  initialize: function(options) {
    // super.initialize()
    App.CommonView.prototype.initialize.call(this, options);
    
    this.collection.on('reset', this.render, this);
    this.collection.on('change', this.render, this);
  },
  events: {
    'click .del': 'delTweak',
  },
  delTweak: function() {
    console.log("deltweak");
  },
});