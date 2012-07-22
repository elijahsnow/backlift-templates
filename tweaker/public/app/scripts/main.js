//  (c) 2012 Cole Krumbholz, SendSpree Inc.
//
//  This document may be used and distributed in accordance with 
//  the MIT license. You may obtain a copy of the license at 
//    http://www.opensource.org/licenses/mit-license.php


// render_layout(contentView, menuView):
// renders the contentView into the main page layout template
// and optionally renders a menu into the titlebar. It
// wont render the whole page unless it needs to.

var render_layout = function(contentView, menuView) {

  if (!App.layoutView) {

    // the top titlebar, may contain a menu
    App.titlebarView = new App.CommonView({
      template: JST.titlebar,
      subviews: {
        "#menu": menuView,
      }
    }); 

    // the main layout view where all content goes
    App.layoutView = new App.CommonView({
      template: JST.layout, 
      subviews: {
        "#titlebar": App.titlebarView,
        "#content": contentView,
      },
    });

    $('body').append(App.layoutView.render().el);      

  } else {
    App.layoutView.renderSubview("#content", contentView);
    App.titlebarView.renderSubview("#menu", menuView);
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

    App.userView = new App.CommonView({
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

    render_layout(App.userView);

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
    "tweaks": "homePage",
    "stream": "streamPage",
    "followers": "followersPage",
    "following": "followingPage",
    "email-verified": "verifiedHandler",
    "*path": "notFoundHandler",
  },


  landingPage: function () {

    // redirect if user logged in

    if ($.cookie("userid")) {
      return this.homePage();
    }

    // setup view hierarchy

    var tweakListView = new App.TweakListView({
      collection: App.tweaks,
      template: JST.tweaks,
      params: { filter: null },
      render_on: "reset",
    });

    var landingView = new App.CommonView({
      collection: App.tweaks,
      template: JST.landing, 
      subviews: { "#tweaks": tweakListView, }
    });

    render_layout(landingView);
  },


  homePage: function () {

    Backlift.with_user( function (user) {
  
      var tweakListView = new App.TweakListView({
        collection: App.tweaks,
        template: JST.tweaks,
        params: { filter: function () { return [ user.id ]; } },
        render_on: "reset sync remove",
      });

      var subnavbar = App.make_menu(JST.menu, {
        options: user_menu_options, 
        current: "tweaks"
      }, this);

      render_user_layout(user, tweakListView, subnavbar);

    }, App.create_user);
  },


  streamPage: function () {

    Backlift.with_user( function (user) {

      var tweakListView = new App.TweakListView({
        collection: App.tweaks,
        template: JST.tweaks,
        params: { filter: function() { return user.get("following"); } },
        render_on: "reset sync remove",
      });

      var subnavbar = App.make_menu(JST.menu, {
        options: user_menu_options, 
        current: "stream"
      }, this);

      render_user_layout(user, tweakListView, subnavbar);

    }, App.create_user);
  },


  followersPage: function () {

    Backlift.with_user( function (user) {

      var followersView = new App.FollowersView({
        collection: App.followers,
      }, user);

      var subnavbar = App.make_menu(JST.menu, {
        options: user_menu_options, 
        current: "followers"
      }, this);

      render_user_layout(user, followersView, subnavbar);

    }, App.create_user);
  },


  followingPage: function () {

    Backlift.with_user( function (user) {

      var followingView = new App.FollowingView({}, user);

      var subnavbar = App.make_menu(JST.menu, {
        options: user_menu_options, 
        current: "following"
      }, this);

      render_user_layout(user, followingView, subnavbar);

    }, App.create_user);
  },


  // verifiedHandler: the page users see after they
  // verify their email address

  verifiedHandler: function() {

    var verifiedView = new App.CommonView({
      template: JST.verified,
    });

    render_layout(verifiedView);

  },
  

  // notFoundHandler: any invalid url will be redirected
  // here

  notFoundHandler: function(path) {
    window.location.replace("/backlift/error/404/"+path);
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