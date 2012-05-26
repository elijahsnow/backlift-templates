//  (c) 2012 Cole Krumbholz, SendSpree Inc.
//
//  This document may be used and distributed in accordance with 
//  the MIT license. You may obtain a copy of the license at 
//    http://www.opensource.org/licenses/mit-license.php


// window.App: the global App object. After this line, you can
// attach new objects to the App name space like so:
// App.MyAppObject = {}

window.App = {}


// App.CommonView : a convenience View class that facilitates
// heirarchical layouts using templates. Renders the given template
// with the given parameters along with the view's model or 
// collection and the current username. Then attaches the given 
// subviews according to jquery selectors.

App.CommonView = Backbone.View.extend({

  // initialize(options):
  //
  //   options.template: (required)
  //     the template used to render the view
  //
  //   options.params: (optional)
  //     an object with a list of key-value pairs
  //     that will be passed to the template when
  //     rendered
  //
  //   options.subviews: (optional)
  //     an object in which the keys are jquery
  //     selectors and the values are other
  //     Backbone.View objects. When rendered
  //     the subviews will be attached to the dom
  //     based on the keys. Example:
  //
  //       options.templates = {
  //         '#title': titleView,
  //       };

  initialize: function(options) {
    this.template = options.template;
    this.params = options.params || {};
    this.subviews = options.subviews || {};
  },

  // render: renders the view's template with 
  // the given parameters and then attaches the 
  // views based on their jquery selectors.
  //
  // Each template is passed three automatic 
  // parameters if set:
  //   - model: the view's model if set
  //   - collection: the collection if set
  //   - username: current username or null

  render: function() {
    var params = _.clone(this.params);

    // add common context
    params.username = $.cookie('user');
    if (this.model) params.model = this.model;
    if (this.collection) params.collection = this.collection;

    // render template
    this.$el.html(this.template(params));

    // render subviews
    for (var s in this.subviews) {
      this.$(s).html(this.subviews[s].render().el);

      // // replacing this.$el.html may break event bindings.
      // // If that happens, you can uncomment this line
      // // to re-bind events for subviews: 
      // this.subviews[s].delegateEvents();
    }
    return this;
  },

});