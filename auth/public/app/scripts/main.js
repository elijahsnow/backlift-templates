//  (c) 2012 Cole Krumbholz, SendSpree Inc.
//
//  This document may be used and distributed in accordance with 
//  the MIT license. You may obtain a copy of the license at 
//    http://www.opensource.org/licenses/mit-license.php

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

    App.render_layout(landingView);

  },


  // homeHandler: the user's home page

  homePage: function () {

    App.with_user( function (user) {

      var homeView = new App.CommonView({
        template: JST.home,
      });

      var menu = App.make_menu({
        home: "/home", 
        other: "/other"
      }, "home");

      App.render_layout(homeView, menu);

    });
  },


  // otherHandler: another user page
  
  otherPage: function () {

    App.with_user( function (user) {
  
      var userStatsView = new App.UserStatsView({
        model: user,
      });

      var otherView = new App.CommonView({
        template: JST.other,
        subviews: {
          "#userstats": userStatsView,
        },
      });

      var menu = App.make_menu({
        home: "/home", 
        other: "/other"
      }, "other");

      App.render_layout(otherView, menu);

    });
  },


  // verifiedHandler: the page users see after they
  // verify their email address

  verifiedHandler: function() {

    var verifiedView = new App.CommonView({
      template: JST.verified,
    });

    var menu = App.make_menu({
      home: "/home", 
      other: "/other"
    });

    App.render_layout(verifiedView, menu);

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