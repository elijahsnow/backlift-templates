//  (c) 2012 Cole Krumbholz, SendSpree Inc.
//
//  This document may be used and distributed in accordance with 
//  the MIT license. You may obtain a copy of the license at 
//    http://www.opensource.org/licenses/mit-license.php

App.MainRouter = Backbone.Router.extend({

  // _init_user: should be called when handling any route
  // that needs access to user data. Create's the App.user
  // object, attaches a login view to the $('body')
  // element, and fetches the user.

  _init_user: function () {
    if (!App.user) {

      // create user

      App.user = new App.UserModel({
        following: [],
      });

      App.followers = new App.Followers();

      App.user.on('change', function(userModel) {
        App.followers.fetch({
          data: {'following__contains': userModel.id},
        });
      });

      // login if needed, and fetch the user model

      var loginView = new Backlift.LoginRegisterView({model: App.user}); 
      loginView.fetchUserModel();
    }
  },


  routes: {
    "": "landingPage",
    "home": "homeHandler",
  },


  landingPage: function () {

    // redirect if user logged in

    if ($.cookie('user')) {
      return this.homeHandler();
    }

    App.user = null;

    $('body').empty();

    // setup view hierarchy

    var navView = new App.CommonView({
      template: JST.nav,
    });

    var tweakListView = new App.TweakListView({
      collection: App.tweaks,
      template: JST.tweaks,
    });

    var homeView = new App.CommonView({
      collection: App.tweaks,
      template: JST.home, 
      subviews: { '#tweaks': tweakListView, }
    });

    var layoutView = new App.CommonView({ 
      template: JST.layout, 
      subviews: {
        '#nav': navView,
        '#content': homeView,
      },
    });

    // render

    $('body').append(layoutView.render().el);
  },


  homeHandler: function () {

    $('body').empty();

    this._init_user();

    // setup view hierarchy

    var navView = new App.CommonView({
      template: JST.nav,
    }); 

    var tweakListView = new App.TweakListView({
      collection: App.tweaks,
      template: JST.tweaks,
    });

    var followerCountView = new App.NumFollowersView({
      collection: App.followers,
    });

    var userView = new App.UserView({
      model: App.user,
      template: JST.user,
      subviews: {
        '#tweaks': tweakListView,
        '#folcount': followerCountView,
      },
    }, tweakListView);

    var layoutView = new App.CommonView({
      template: JST.layout, 
      subviews: {
        '#nav': navView,
        '#content': userView,
      },
    });

    // if the user model hasn't been fetched yet, wait to render
    // the layout. Otherwise render the layout now.

    if (App.user.isNew()) { 
      // isNew indicates not fetched, so attach a stub
      $('body').append(layoutView.el);
      // render the layout once the user model arrives
      App.user.on('change', layoutView.render, layoutView);
    } else {
      $('body').append(layoutView.render().el);      
    }
  },

});


$(function(){
  // common initialization
  App.tweaks = new App.Tweaks();
  App.tweaks.fetch({data: {latest: 30}});

  // kick off app
  new App.MainRouter();
  Backbone.history.start({pushState: true}); 
});