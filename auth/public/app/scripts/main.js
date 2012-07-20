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


App.MainRouter = Backbone.Router.extend({

  routes: {
    "": "landingPage",
    "home": "homePage",
    "other": "otherPage",
    "email-verified": "verifiedHandler",
    "*path": "notFoundHandler",
  },


  // landingPage: the public home page

  landingPage: function () {

    App.user = null;

    var landingView = new App.CommonView({
      template: JST.landing, 
    });

    render_layout(landingView);

  },


  // homeHandler: the user's home page

  homePage: function () {

    Backlift.with_user( function (user) {

      var homeView = new App.CommonView({
        template: JST.home,
      });

      var menu = App.make_menu( JST.menu, { 
        options: { home: "/home", other: "/other" }, 
        current: 'home'
      }, this);

      render_layout(homeView, menu);

    }, App.createUser);
  },


  // otherHandler: another user page
  
  otherPage: function () {

    Backlift.with_user( function (user) {
  
      var userStatsView = new App.UserStatsView({
        model: user,
      });

      var otherView = new App.CommonView({
        template: JST.other,
        subviews: {
          "#userstats": userStatsView,
        },
      });

      var menu = App.make_menu( JST.menu, { 
        options: { home: "/home", other: "/other" }, 
        current: 'other'
      }, this);

      render_layout(otherView, menu);

    }, App.createUser);
  },


  // verifiedHandler: the page users see after they
  // verify their email address

  verifiedHandler: function() {

    var verifiedView = new App.CommonView({
      template: JST.verified,
    });

    var menu = App.make_menu( JST.menu, { 
      options: { home: "/home", other: "/other" }, 
      current: ''
    }, this);

    render_layout(verifiedView, menu);

  },


  // notFoundHandler: any invalid url will be redirected
  // here

  notFoundHandler: function(path) {
    window.location.replace("/backlift/error/404/"+path);
  },

});


$(function(){
  App.mainRouter = new App.MainRouter();
  Backbone.history.start({pushState: true}); 
});