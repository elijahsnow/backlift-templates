//  (c) 2012 Cole Krumbholz, SendSpree Inc.
//
//  This document may be used and distributed in accordance with 
//  the MIT license. You may obtain a copy of the license at 
//    http://www.opensource.org/licenses/mit-license.php


// render_layout(contentView, menuView):
// renders the contentView into the main layout template
// and optionally renders a menu into the titlebar. It
// only renders the layout template the first time.

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
    "": "homePage",
    "other": "otherPage",
    "*path": "notFoundHandler",
  },


  // homePage: the public home page.

  homePage: function () {

    var homeView = new App.CommonView({
      template: JST.home, 
    });

    var menu = App.make_menu( JST.menu, { 
      options: { home: "/", other: "/other" }, 
      current: "home"
    }, this);

    render_layout(homeView, menu);
  },


  // otherHandler: another page
  
  otherPage: function () {

    var otherView = new App.CommonView({
      template: JST.other,
    });

    var menu = App.make_menu( JST.menu, { 
      options: { home: "/", other: "/other" }, 
      current: "other"
    }, this);

    render_layout(otherView, menu);
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