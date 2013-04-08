//  (c) 2012 Cole Krumbholz, SendSpree Inc.
//
//  This document may be used and distributed in accordance with 
//  the MIT license. You may obtain a copy of the license at 
//    http://www.opensource.org/licenses/mit-license.php

App = this.App || {};


// render_layout(user, contentView, menuView):
// renders the contentView into the main page layout template
// and optionally renders a menu into the titlebar. It
// wont render the whole page unless it needs to.

var render_layout = function(user, contentView, menuView) {

  var username = user ? user.get("username") : "";

  if (!App.layoutView) {

    // the top titlebar, may contain a menu
    App.titlebarView = new Backlift.CommonView({
      template: JST.titlebar,
      subviews: {
        "#menu": menuView,
      },
      params: {
        username: username,
      },
    }); 

    // the main layout view where all content goes
    App.layoutView = new Backlift.CommonView({
      template: JST.layout, 
      subviews: {
        "#titlebar": App.titlebarView,
        "#content": contentView,
      },
    });

    $('body').append(App.layoutView.render().el);      

  } else {
    App.titlebarView.params.username = username;
    App.titlebarView.renderSubview("#menu", menuView);
    App.layoutView.renderSubview("#content", contentView);
  }

};


// render_user_layout(user, contentView, subnavbarView):
// renders the layout for a logged in user including the 
// passed in content and subnavbar views.

var render_user_layout = function(user, contentView, subnavbarView) {

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
      model: user,
    });

    App.userView = new Backlift.CommonView({
      model: user,
      template: JST.userlayout,
      subviews: {
        '#usercontent': contentView,
        '#subnavbar': subnavbarView,
        '#addtweak': addTweakView,
        '#tweakcount': tweakCountView,
        '#followingcount': followingCountView,
        '#followercount': followerCountView,
      },
    });

    render_layout(user, App.userView);

  } else {
    App.userView.renderSubview('#usercontent', contentView);
    App.userView.renderSubview('#subnavbar', subnavbarView);
  }

};


var user_menu_options = {
  tweaks: "/tweaks", 
  stream: "/stream", 
  following: "/following", 
  followers: "/followers"        
};


App.MainRouter = Backbone.Router.extend({

  routes: {
    "": "landingPage",
    "index.html": "landingPage", 
    "tweaks": "homePage",
    "stream": "streamPage",
    "followers": "followersPage",
    "following": "followingPage",
    "email-verified": "verifiedHandler",
    "*path": "notFoundHandler",
  },


  landingPage: function () {

    // redirect if user logged in

    if ($.cookie("backlift_session")) {
      return this.homePage();
    }

    // setup view hierarchy

    var tweakListView = new App.TweakListView({
      collection: App.tweaks,
      template: JST.tweaks,
      params: { filter: null, username: null },
      render_on: "reset",
    });

    var landingView = new Backlift.CommonView({
      collection: App.tweaks,
      template: JST.landing, 
      subviews: { "#tweaks": tweakListView, }
    });

    render_layout(null, landingView);
  },


  homePage: function () {

    var router = this;

    Backlift.with_user( function (user) {

      var username = user.get("username");
  
      var tweakListView = new App.TweakListView({
        collection: App.tweaks,
        template: JST.tweaks,
        params: { 
          filter: function () { return [ username ]; },
          username: username,
        },
        render_on: "reset add remove",
      });

      var subnavbar = App.make_menu(JST.menu, {
        options: user_menu_options, 
        current: "tweaks"
      }, router);

      render_user_layout(user, tweakListView, subnavbar);

    }, App.create_user);
  },


  streamPage: function () {

    var router = this;

    Backlift.with_user( function (user) {

      var tweakListView = new App.TweakListView({
        collection: App.tweaks,
        template: JST.tweaks,
        params: { 
          filter: function() { return user.get("profile").following; },
          username: user.get("username"),
        },
        render_on: "reset",
      });

      var subnavbar = App.make_menu(JST.menu, {
        options: user_menu_options, 
        current: "stream"
      }, router);

      render_user_layout(user, tweakListView, subnavbar);

    }, App.create_user);
  },


  followersPage: function () {

    var router = this;

    Backlift.with_user( function (user) {

      var followersView = new App.FollowersView({
        collection: App.followers,
      }, user);

      var subnavbar = App.make_menu(JST.menu, {
        options: user_menu_options, 
        current: "followers"
      }, router);

      render_user_layout(user, followersView, subnavbar);

    }, App.create_user);
  },


  followingPage: function () {

    var router = this;

    Backlift.with_user( function (user) {

      var followingView = new App.FollowingView({}, user);

      var subnavbar = App.make_menu(JST.menu, {
        options: user_menu_options, 
        current: "following"
      }, router);

      render_user_layout(user, followingView, subnavbar);

    }, App.create_user);
  },


  // verifiedHandler: the page users see after they
  // verify their email address

  verifiedHandler: function() {

    var verifiedView = new Backlift.CommonView({
      template: JST.verified,
    });

    render_layout(null, verifiedView);

  },
  

  // notFoundHandler: any invalid url will be redirected
  // here

  notFoundHandler: function(path) {
    window.location.replace("/backlift/error/404/"+path);
  },

});

// make_menu: creates a Backbone View that will render 
// the given template with the given params. Adds a 
// click event handler that will intercept any clicks 
// on links whithin the view and navigate to it's href 
// using the given router. Example:
//
//   App.make_menu( JST.menu, { 
//     options: { home: "/", other: "/other" }, 
//     current: 'home'
//   }, App.mainRouter);

App.make_menu = function(template, params, router) {
  return new Backlift.CommonView({
    template: template,
    params: params,
    events: {
      "click a": function (ev) {
        var link = $(ev.target).attr("href");
        router.navigate(link, {trigger: true});
        return false;
      }
    }
  });
  
};

$(function(){
  // common initialization
  App.tweaks = new App.Tweaks();
  App.tweaks.fetch({data: {latest: 30}});

  // kick off app
  App.mainRouter = new App.MainRouter();
  Backbone.history.start({pushState: true}); 
});