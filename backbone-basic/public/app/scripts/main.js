//  (c) 2012 Cole Krumbholz, SendSpree Inc.
//
//  This document may be used and distributed in accordance with 
//  the MIT license. You may obtain a copy of the license at 
//    http://www.opensource.org/licenses/mit-license.php


App.MainRouter = Backbone.Router.extend({

  // Menu options that will be displayed in the titlebar

  menuOptions: [
    {name: "home", link: "/"},
    {name: "other", link: "/other"},
  ],


  // routes: URL patterns mapped to handler functions

  routes: {
    "": "homePage",
    "other": "otherPage",
    "*path": "notFoundHandler"
  },


  // homePage: the public home page.

  homePage: function () {

    var homeView = new App.CommonView({
      template: Handlebars.templates.home
    });

    this.render_layout(homeView, "home");
  },


  // otherHandler: another page
  
  otherPage: function () {

    var otherView = new App.CommonView({
      template: Handlebars.templates.other
    });

    this.render_layout(otherView, "other");
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

  render_layout: function(contentView, currentPage) {

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