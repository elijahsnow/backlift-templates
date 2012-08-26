//  (c) 2012 Cole Krumbholz, SendSpree Inc.
//
//  This document may be used and distributed in accordance with 
//  the MIT license. You may obtain a copy of the license at 
//    http://www.opensource.org/licenses/mit-license.php

var MyThings = Backbone.Collection.extend({
  url: '/backliftapp/mythings',
});

var MyView = Backbone.View.extend({

  el: '#mainview',

  initialize: function() {
    this.collection.bind('add', this.render, this);
    this.collection.bind('remove', this.render, this);
    this.collection.bind('reset', this.render, this);
  },

  render: function() {
    var t = _.template($('#mainview-template').html(), {
      thinglist: this.collection
    });
    this.$('ul').html(t);
  },

  events: {
    "click #add-btn": "add_thing",
    "click .thing-del-btn": "del_thing",
  },

  add_thing: function (ev) {
    var thing_name = $('#add-input').val();
    newthing = new Backbone.Model({name: thing_name});
    this.collection.add(newthing);
    newthing.save();
  },

  del_thing: function (ev) {
    // format of button id is 'del-' + cid
    var cid = ev.target.id.split('-')[1]; 
    var oldthing = this.collection.getByCid(cid);
    oldthing.destroy();
    this.collection.remove(oldthing);
  },
}); 


$(function() {
  var myThings = new MyThings();
  var myView = new MyView({collection: myThings});
  myThings.fetch();
});