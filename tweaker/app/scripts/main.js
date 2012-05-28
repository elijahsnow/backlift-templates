//  (c) 2012 Cole Krumbholz, SendSpree Inc.
//
//  This document may be used and distributed in accordance with 
//  the MIT license. You may obtain a copy of the license at 
//    http://www.opensource.org/licenses/mit-license.php

App.MainRouter = Backbone.Router.extend({

  routes: {
    "": "landingPage",
    "tweaks": "homeHandler",
    "stream": "streamHandler",
    "followers": "followersHandler",
    "following": "followingHandler",
  },


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

  
  // _render_layout(contentView):
  // renders the contentView into the main page layout template

  _render_layout: function(contentView) {

    if (!App.layoutView) {

      var titlebarView = new App.CommonView({
        template: JST.titlebar,
      }); 

      App.layoutView = new App.CommonView({
        template: JST.layout, 
        subviews: {
          '#titlebar': titlebarView,
          '#content': contentView,
        },
      });

      $('body').append(App.layoutView.render().el);      

    } else {
      App.layoutView.renderSubview('#content', contentView);
    }
  },

  
  // _render_user_layout(navbarView, contentView):
  // renders the layout for a logged in user including the 
  // passed in content and navbar views.

  _render_user_layout: function(navbarView, contentView) {

    if (!App.userView) {

      var addTweakView = new App.AddTweakView({
        collection: App.tweaks,
        template: JST.addtweak,
      });

      var tweakCountView = new App.TweakCountView({
        collection: App.tweaks,
      });

      var followerCountView = new App.NumFollowersView({
        collection: App.followers,
      });

      var followingCountView = new App.NumFollowingView({
        model: App.user,
      });

      App.userView = new App.CommonView({
        model: App.user,
        template: JST.userlayout,
        subviews: {
          '#navbar': navbarView,
          '#usercontent': contentView,
          '#addtweak': addTweakView,
          '#tweakcount': tweakCountView,
          '#followingcount': followingCountView,
          '#followercount': followerCountView,
        },
      });

      // If the user model hasn't been fetched yet, wait to render
      // the layout. Otherwise render the layout immediately.
      if (App.user.isNew()) { 
        // render the layout once the user model arrives
        App.user.on('change', function() {
          this._render_layout(App.userView);
        }, this);
      } else {
        this._render_layout(App.userView);
      }   

    } else {
      App.userView.renderSubview('#navbar', navbarView);
      App.userView.renderSubview('#usercontent', contentView);
    }

  },


  _make_navbar: function(current) {
    return new App.CommonView({
      template: JST.navbar,
      params: {
        options: ['tweaks', 'stream', 'following', 'followers'],
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


  landingPage: function () {

    // redirect if user logged in

    if ($.cookie('user')) {
      return this.homeHandler();
    }

    App.user = null;

    $('body').empty();

    // setup view hierarchy

    var tweakListView = new App.TweakListView({
      collection: App.tweaks,
      template: JST.tweaks,
      params: { filter: null },
      render_on: 'reset',
    });

    var landingView = new App.CommonView({
      collection: App.tweaks,
      template: JST.landing, 
      subviews: { '#tweaks': tweakListView, }
    });

    this._render_layout(landingView);
  },


  homeHandler: function () {

    this._init_user();

    var tweakListView = new App.TweakListView({
      collection: App.tweaks,
      template: JST.tweaks,
      params: { filter: function () { return [$.cookie('user')]; } },
      render_on: 'reset sync remove',
    });

    var navbar = this._make_navbar('tweaks');

    this._render_user_layout(navbar, tweakListView);
  },


  streamHandler: function () {

    this._init_user();

    var tweakListView = new App.TweakListView({
      collection: App.tweaks,
      template: JST.tweaks,
      params: { filter: function() { return App.user.get('following'); } },
      render_on: 'reset sync remove',
    });

    var navbar = this._make_navbar('stream');

    this._render_user_layout(navbar, tweakListView);
  },


  followersHandler: function () {

    this._init_user();

    var followersView = new App.FollowersView({
      collection: App.followers,
    }, App.user);

    var navbar = this._make_navbar('followers');

    this._render_user_layout(navbar, followersView);
  },


  followingHandler: function () {

    this._init_user();

    var followingView = new App.FollowingView({}, App.user);

    var navbar = this._make_navbar('following');

    this._render_user_layout(navbar, followingView);
  },

});


$(function(){
  // common initialization
  App.tweaks = new App.Tweaks();
  App.tweaks.fetch({data: {latest: 30}});

  // kick off app
  App.mainRouter = new App.MainRouter();
  Backbone.history.start({pushState: true}); 
});