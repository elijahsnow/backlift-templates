//  (c) 2012 Cole Krumbholz, SendSpree Inc.
//
//  This document may be used and distributed in accordance with 
//  the MIT license. You may obtain a copy of the license at 
//    http://www.opensource.org/licenses/mit-license.php

App.MainRouter = Backbone.Router.extend({

  routes: {
    "": "landingPage",
    "home": "homeHandler",
    "other": "otherHandler",
  },


  // _with_user: should be called when handling any route
  // that needs access to user data. Creates the App.user
  // object, attaches a login view to the $('body')
  // element, and fetches the user. Calls do_function
  // once the user is fetched, with this as the context.

  _with_user: function (do_function) {

    if (!App.user) {

      // create user
      App.user = new App.UserModel({
        // TODO: put default user attributes here
      });

      // a function that will be called once user fetched
      var that = this;
      var on_user_fetched = function() {
        do_function.call(that);
      }

      // login if needed, and fetch the user model
      var loginView = new Backlift.LoginRegisterView({
        model: App.user,
        success: on_user_fetched,
      });
      loginView.fetchUserModel();

    } else {
      do_function.call(this);
    }
  },

  
  // _render_layout(contentView, menuView):
  // renders the contentView into the main page layout template
  // and optionally renders a menu into the titlebar

  _render_layout: function(contentView, menuView) {

    if (!App.layoutView) {

      // the top titlebar, may contain a menu
      App.titlebarView = new App.CommonView({
        template: JST.titlebar,
        subviews: {
          '#menu': menuView,
        }
      }); 

      // the main layout view where all content goes
      App.layoutView = new App.CommonView({
        template: JST.layout, 
        subviews: {
          '#titlebar': App.titlebarView,
          '#content': contentView,
        },
      });

      $('body').append(App.layoutView.render().el);      

    } else {
      App.layoutView.renderSubview('#content', contentView);
      App.titlebarView.renderSubview('#menu', menuView);
    }
  },


  // _make_menu: convenience function for creating a 
  // menu view

  _make_menu: function(options, current) {
    return new App.CommonView({
      template: JST.menu,
      params: {
        options: options,
        current: current,
      },
      events: {
        'click [id^="nav-"]': function (ev) {
          var link = $(ev.target).attr('href');
          App.mainRouter.navigate(link, {trigger: true});
          return false;
        }
      }
    });
  },


  // landingPage: the public home page. Displayed if
  // no user is logged in

  landingPage: function () {

    // redirect if user logged in

    if ($.cookie('user')) {
      return this.homeHandler();
    }

    App.user = null;

    var landingView = new App.CommonView({
      template: JST.landing, 
    });

    this._render_layout(landingView);
  },


  // homeHandler: the user's home page

  homeHandler: function () {

    this._with_user( function () {

      var homeView = new App.CommonView({
        template: JST.home,
      });

      var menu = this._make_menu(['home', 'other'], 'home');

      this._render_layout(homeView, menu);

    });
  },


  // otherHandler: another user page
  
  otherHandler: function () {

    this._with_user( function () {
  
      var userStatsView = new App.UserStatsView({
        model: App.user,
      });

      var otherView = new App.CommonView({
        template: JST.other,
        subviews: {
          '#userstats': userStatsView,
        },
      });

      var menu = this._make_menu(['home', 'other'], 'other');

      this._render_layout(otherView, menu);

    });
  },

});


$(function(){
  App.mainRouter = new App.MainRouter();
  Backbone.history.start({pushState: true}); 
});