//  backlift-jquery-helpers.js
//  (c) 2012 Cole Krumbholz, SendSpree Inc.
//
//  This document may be used and distributed in accordance with 
//  the MIT license. You may obtain a copy of the license at 
//    http://www.opensource.org/licenses/mit-license.php
//
//  Depends on jquery, or some library that exports the $ object

(function(setup_class){

  // Backlift namespace
  var Backlift = this.Backlift;
  if (typeof Backlift === 'undefined') {
    Backlift = this.Backlift = {};
  }


  // load John Resig's simple inheritence (below)
  var Simple = {};
  setup_class.call(Simple);


  // Backlift.PersistedObject:
  // Class that can be used to store simple javascript
  // objects onto the backlift server.

  Backlift.PersistedObject = Simple.Class.extend({

    // PersistedObject.collection:
    // Property defining the name of the collection.
    // Should be overriden by subclasses.

    collection: undefined,


    // PersistedObject.init(data):
    // Initialize an instance of this class with data
    // from a javascript object. All subclasses should
    // call this method to ensure the id property is set

    init: function(data) {
      this.id = data.id;
    },


    // PersistedObject.getOwnProperties(options):
    // Returns a shallow copy of this PersistedObject
    // without prototype chain. By default only returns
    // properties, not methods. 
    // options:
    //      includeMethods: also return methods

    getOwnProperties: function (options) {
      var props = {};
      for (var prop in this) {
        if (!this.hasOwnProperty(prop)) continue;
        if (typeof this[prop] === 'function' && !(
            options && 
            options.includeMethods === true
          )) continue;
        props[prop] = this[prop];
      }
      return props;
    },


    // PersistedObject.toObject():
    // Returns this object as a simple javascript
    // Object without the PersistedObject 
    // prototype methods. Used to strip out stuff
    // that shouldn't be saved to the server.

    toObject: function() {
      return this.getOwnProperties({includeMethods: false});
    },


    // PersistedObject.stringify(object):
    // Converts an object into a JSON string. Can
    // be overridden to provide custom stringification.

    stringify: function(object) {
      if ((typeof JSON == "undefined") || (typeof JSON.stringify == "undefined")) {
        throw "JSON.stringify() does not exist. JavaScript json2 library required.";
      }
      return JSON.stringify(object);
    },


    // PersistedObject.update(data):
    // Update this object with new data. Can be overriden
    // to enable custom update. (for example to set knockout
    // observable properties)

    update: function(data) {
      $.extend(this, data);
    },


    // PersistedObject.isNew():
    // Returns false if the object is stored on the server. 
    // Expects the id attribute to be set if the object
    // has been stored.

    isNew: function() {
      return typeof this.id === 'undefined' || typeof this.id === 'null' || this.id === '';
    },


    // PersistedObject.getURLRoot():
    // Returns the url for this object's collection

    getURLRoot: function () {
      if (typeof this.collection === 'undefined' || 
          typeof this.collection === 'null' ||
          this.collection === '') {
        throw "invalid collection";
      }
      return "/backliftapp/"+this.collection;
    },


    // PersistedObject.getURL():
    // Returns the url for this object

    getURL: function() {
      if (this.isNew()) {
        throw "no id, object must be saved() first";
      }
      return this.getURLRoot() + "/" + this.id;            
    },


    // PersistedObject.save(changes):
    // Save's this object to the server. Optionally
    // saves the object modified by a changes object.
    // If the object is already stored on the server
    // it will use the PUT method, otherwise it will
    // POST the object to the collection.
    //
    // Note that the changes will not be set on the
    // local object, just on the remote object. This
    // is done for compatibility with change event
    // handlers that are triggered before the object
    // is modified, such as knockout's.

    save: function(changes) {
      var self = this;
      var method = self.isNew() ? "post" : "put";
      var url = self.isNew() ? self.getURLRoot() : self.getURL();
      var data = self.toObject();
      if (changes) {
        $.extend(data, changes);
      }
      $.ajax(url, {
        data: self.stringify(data),
        type: method, contentType: "application/json",
        success: function(data) {
          self.update(data);
        }
      });
    },


    // PersistedObject.destroy():
    // Deletes the object from the server.

    destroy: function() {
      var self = this;
      if (!self.isNew()) {
        $.ajax(self.getURL(), {
          type: "delete",
          success: function() {
            delete self.id;
          },
        });
      }
    },

  });

}).call(this, 

/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 * http://ejohn.org/blog/simple-javascript-inheritance
 * Modified for use in Backlift.PersistedObject
 */
// Inspired by base2 and Prototype
function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  // The base Class implementation (does nothing)
  this.Class = function(){};
  
  // Create a new Class that inherits from this class
  this.Class.extend = function(prop) {
    var _super = this.prototype;
    
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
    
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" && 
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
            
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
            
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
            
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
    
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
    
    // Populate our constructed prototype object
    Class.prototype = prototype;
    
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;
    
    return Class;
  };
});
