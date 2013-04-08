//  backlift-knockout-helpers.js
//  (c) 2012 Cole Krumbholz, SendSpree Inc.
//
//  This document may be used and distributed in accordance with 
//  the MIT license. You may obtain a copy of the license at 
//    http://www.opensource.org/licenses/mit-license.php
//
//  Depends on knockout.js and backlift-jquery-helpers.js

(function(){

  // Backlift namespace
  var Backlift = this.Backlift;
  if (typeof Backlift === 'undefined') {
    Backlift = this.Backlift = {};
  }


  // Backlift.PersistedKnockoutObject:
  // Subclass of PersistedObject used to store knockout
  // objects onto the backlift server.

  Backlift.PersistedKnockoutObject = Backlift.PersistedObject.extend({

    // PersistedObject toObject function strips out 
    // methods. We need to include methods to preserve
    // observables.

    toObject: function() {
      return this.getOwnProperties({includeMethods: true});
    },


    // knockout's toJSON correctly handles observables.

    stringify: ko.toJSON,


    // The update() method is called in response to a 
    // successful save() to update properties based on 
    // server truth. For knockout we need to check for 
    // observables and set them differently then regular 
    // js object properties.

    update: function(data) {
      for (var prop in data) {
        if (data.hasOwnProperty(prop)) {
          if (typeof this[prop] === 'function') {
            // this data property corresponds to a 
            // function. Assumes this is an observable
            // and calls the function passing the data 
            this[prop](data[prop]);
          } else {
            this[prop] = data[prop];
          }
        }
      }
    },

  });

}).call(this);
