//  (c) 2012 Cole Krumbholz, SendSpree Inc.
//
//  This document may be used and distributed in accordance with 
//  the MIT license. You may obtain a copy of the license at 
//    http://www.opensource.org/licenses/mit-license.php


App.MainRouter = Backbone.Router.extend({

  // Menu options that will be displayed in the titlebar

  menuOptions: [
    {name: "home", link: "/home"},
    {name: "other", link: "/other"},
  ],


  // routes: URL patterns mapped to handler functions

  routes: {
    "": "landingPage",
    "home": "homePage",
    "other": "otherPage",
    "email-verified": "verifiedHandler",
    "*path": "notFoundHandler",
  },


  // landingPage: the public home page

  landingPage: function () {

    var landingView = new App.CommonView({
      template: Handlebars.templates.landing, 
    });

    this.render_layout(null, landingView, null);

  },

  
  // homeHandler: the user's home page

  homePage: function () {

    var self = this;

    Backlift.with_user( function (user) {

      var homeView = new App.CommonView({
        template: Handlebars.templates.home,
        params: {
          username: user.get("username"),
        }
      });

      self.render_layout(user, homeView, "home");

    });
  },


  // otherHandler: another user page
  
  otherPage: function () {

    var self = this;

    Backlift.with_user( function (user) {
  
      var userStatsView = new App.UserStatsView({
        model: user,
      });

      var otherView = new App.CommonView({
        template: Handlebars.templates.other,
        subviews: {
          "#userstats": userStatsView,
        },
      });

      self.render_layout(user, otherView, "other");

    });
  },


  // notFoundHandler: any invalid url will be redirected
  // here

  notFoundHandler: function(path) {
    window.location.replace("/backlift/error/404/"+path);
  },


  // render_layout(contentView, currentPage):
  // renders the contentView into the main layout template
  // and renders a menu into the titlebar. It only renders 
  // the layout template the first time.

  render_layout: function(user, contentView, currentPage) {

    var username = user ? user.get("username") : "";

    if (!this.menuView) {

      // the menu that will be rendered into the titlebar
      this.menuView = App.makeMenu(
        Handlebars.templates.menu, 
        this.menuOptions, 
        this
      );
      this.menuView.setCurrent(currentPage);

      // the top titlebar, may contain a menu
      this.titlebarView = new App.CommonView({
        template: Handlebars.templates.titlebar,
        subviews: {
          "#menu": this.menuView
        },
        params: {
          username: username
        }
      }); 

      // the main layout view where all content goes
      this.layoutView = new App.CommonView({
        template: Handlebars.templates.layout, 
        subviews: {
          "#titlebar": this.titlebarView,
          "#content": contentView
        }
      });

      $('body').append(this.layoutView.render().el);      

    } else {
      this.menuView.setCurrent(currentPage);
      this.menuView.render();
      this.layoutView.renderSubview("#content", contentView);
    }

  }

});


$(function(){
  App.mainRouter = new App.MainRouter();
  Backbone.history.start({pushState: true}); 
});
