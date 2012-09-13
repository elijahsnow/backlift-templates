//  app-helpers.js
//  (c) 2012 Cole Krumbholz, SendSpree Inc.
//
//  This document may be used and distributed in accordance with 
//  the MIT license. You may obtain a copy of the license at 
//    http://www.opensource.org/licenses/mit-license.php


// App.CommonView : a convenience View class that facilitates
// heirarchical layouts using templates. 

App.CommonView = Backbone.View.extend({

  // initialize(options):
  //
  //   options.template: (required)
  //     the template used to render the view.
  //     This can be a function or a string. If
  //     the later, the string will be passed as
  //     the first argument to _.template()
  //
  //   options.params: (optional)
  //     an object with a list of key-value pairs
  //     that will be passed to the template when
  //     rendered. If any value is a function, it
  //     will be called at render time as a 
  //     method of the CommonView object. (the 
  //     "this" variable will refer to the view).
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
  //       options.subviews = {
  //         "#title": titleView,
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

    for (var attr in options) {
      if (options.hasOwnProperty(attr)) {
        this[attr] = options[attr];
      }
    }

    if (this.render_on) {
      if (this.model)
        this.model.on(this.render_on, this.render, this);
      if (this.collection) 
        this.collection.on(this.render_on, this.render, this);
    }
  },

  // templateMethod: The method used to compile 
  // templates. You can override this here or set 
  // the templateMethod option when initializing
  // CommonView

  templateMethod: _.template,

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
    if (this.model) params.model = this.model;
    if (this.collection) params.collection = this.collection;

    // call any parameter functions
    for (k in params) {
      if (typeof params[k] === "function") {
        params[k] = params[k].call(this);
      }
    }

    // render template
    if (typeof this.template === "function") {
      this.$el.html(this.template(params));
    } else if (typeof this.template === "string" &&
               typeof this.params !== "undefined") {
      this.$el.html(this.templateMethod(this.template, params));
    } else {
      this.$el.html(this.template);
    }

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
    if (typeof view === "boolean") {
      reDelegate = view;
      view = null;
    }
    if (this.debug) {
      console.log("rendering "+selector);
    }
    if (view) this.subviews[selector] = view;
    else if (!this.subviews[selector]) return;
    this.$(selector).html(this.subviews[selector].render().el);
    if(reDelegate) this.delegateSubviewEvents(selector);
  },

  // delegateSubviewEvents(): calls delegateEvents on the
  // subview specified by selector

  delegateSubviewEvents: function(selector) {
    if (!this.subviews[selector]) return;
    this.subviews[selector].delegateEvents();
  },

  // debug: when true, logs rendering of each subview

  debug: false

});


// makeMenu: creates a Backbone View that will render 
// the given template with the given menu items passed
// to the template as an items array. Each item should
// include a name, link and optional current property. 
// Adds a click event handler that will intercept any 
// clicks on links whithin the view and navigate to 
// its href using the given router. You can set the 
// current menu option on the returned view by calling
// setCurrent(name). Example:
//
//   var menuView = App.makeMenu( aTemplate, [
//     {name: "home", link: "/", current: true},
//     {name: "other", link: "/other"},
//   ], App.mainRouter);
//   menuView.setCurrent("other");

App.makeMenu = function(template, items, router) {
  return new App.CommonView({
    template: template,
    params: {items: items},
    events: {
      "click a": function (ev) {
        var link = $(ev.target).attr("href");
        router.navigate(link, {trigger: true});
        return false;
      }
    },
    setCurrent: function(current) {
      for (var i=0; i<this.params.items.length; i++) {
        var is_cur = this.params.items[i].name === current;
        this.params.items[i].current = is_cur;
      }
    }
  });
  
};
