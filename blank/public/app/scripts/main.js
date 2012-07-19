//  (c) 2012 Cole Krumbholz, SendSpree Inc.
//
//  This document may be used and distributed in accordance with 
//  the MIT license. You may obtain a copy of the license at 
//    http://www.opensource.org/licenses/mit-license.php

App.MainRouter = Backbone.Router.extend({

  routes: {
    "": "homePage",
    "other": "otherPage",
    "*path": "notFoundHandler",
  },


  // homePage: the public home page.

  homePage: function () {

    var homeView = new App.CommonView({
      template: JST.home, 
    });

    var menu = App.make_menu({home: "/", other: "/other"}, "home");

    App.render_layout(homeView, menu);
  },


  // otherHandler: another page
  
  otherPage: function () {

    var otherView = new App.CommonView({
      template: JST.other,
    });

    var menu = App.make_menu({home: "/", other: "/other"}, "other");

    App.render_layout(otherView, menu);
  },


  // notFoundHandler: any invalid url will be redirected
  // here

  notFoundHandler: function(path) {
    window.location.replace("/backlift/error/404"+path);
  },

});


$(function(){
  App.mainRouter = new App.MainRouter();
  Backbone.history.start({pushState: true}); 
});