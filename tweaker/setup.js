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

var commonViewOptions = ['template', 'params', 'subviews', 'render_on', 'events'];

App.CommonView = Backbone.View.extend({

  // initialize(options):
  //
  //   options.template: (required)
  //     the template used to render the view
  //
  //   options.params: (optional)
  //     an object with a list of key-value pairs
  //     that will be passed to the template when
  //     rendered. If any value is a function, it
  //     will be called at render time as a 
  //     method of the CommonView object. (the 
  //     'this' variable will refer to the view).
  //     Example:
  //
  //       options.params = {
  //         count: function () {
  //           return this.collection.length;
  //         },
  //       };
  //
  //   options.subviews: (optional)
  //     an object in which the keys are jquery
  //     selectors and the values are other
  //     Backbone.View objects. When rendered
  //     the subviews will be attached to the DOM
  //     based on the keys. Example:
  //
  //       options.templates = {
  //         '#title': titleView,
  //       };
  //
  //   options.render_on: (optional)
  //     sets up an event listener on this view's
  //     model or collection that will render 
  //     the view when triggered. Example:
  //
  //       options.render_on = "reset add remove"
  //
  //   options.events: (optional)
  //     sets the events attribute on this view
  //
  //   The above attributes of options will be 
  //   added to the CommonView instance (this)

  initialize: function(options) {
    options.params = options.params || {};
    options.subviews = options.subviews || {};

    // borrowed from Backbone.js view._configure()
    for (var i = 0; i < commonViewOptions.length; i++) {
      var attr = commonViewOptions[i];
      if (options[attr]) this[attr] = options[attr];
    }

    if (this.render_on) {
      if (this.model) 
        this.model.on(this.render_on, this.render, this);
      if (this.collection) 
        this.collection.on(this.render_on, this.render, this);
    }
  },

  // render(): renders the view's template with 
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

    // call any parameter functions
    for (k in params) {
      if (typeof params[k] === 'function') {
        params[k] = params[k].call(this);
      }
    }

    // render template
    this.$el.html(this.template(params));

    // render subviews
    for (var s in this.subviews) {
      this.renderSubview(s);

      // Replacing this.$el.html may break event bindings.
      // If that happens, uncomment the following line to
      // re-bind events for subviews:
      //
      // this.delegateSubviewEvents(s);
      //
      // However, it might be better to structure your
      // view heirarchy so that events don't cause
      // cascading renders.
    }
    return this;
  },

  // renderSubview(selector, view, reDelegate): 
  //   renders a subview.
  //
  //   selector (required): 
  //     The jquery selector that will be used as a 
  //     target when rendering the view.
  //
  //   view (optional):
  //     If present, renders this view into the selector. 
  //     Default behaviour is to look up the view by selector
  //     in the subviews hash created during initialize()
  //
  //   reDelegate (optional):
  //     If true, also call delegateEvents for the subview.

  renderSubview: function(selector, view, reDelegate) {
    if (typeof view === 'boolean') {
      reDelegate = view;
      view = null;
    }
    if (this.debug) {
      console.log("rendering "+selector);
    }
    if (view) this.subviews[selector] = view;
    this.$(selector).html(this.subviews[selector].render().el);
    if(reDelegate) this.delegateSubviewEvents(selector);
  },

  // delegateSubviewEvents(): calls delegateEvents on the
  // subview specified by selector

  delegateSubviewEvents: function(selector) {
    this.subviews[selector].delegateEvents();
  },

  debug: true,

});