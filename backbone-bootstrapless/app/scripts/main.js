//  (c) 2012 Cole Krumbholz, SendSpree Inc.
//
//  This document may be used and distributed in accordance with 
//  the MIT license. You may obtain a copy of the license at 
//    http://www.opensource.org/licenses/mit-license.php

App = this.App = {};

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

    var homeView = new Backlift.CommonView({
      template: Handlebars.templates.home
    });

    this.render_layout(homeView, "home");
  },


  // otherHandler: another page
  
  otherPage: function () {

    var otherView = new Backlift.CommonView({
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
      this.titlebarView = new Backlift.CommonView({
        template: Handlebars.templates.titlebar,
        subviews: {
          "#menu": this.menuView
        }
      }); 

      // the main layout view where all content goes
      this.layoutView = new Backlift.CommonView({
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

// makeMenu: creates a Backbone View that will render 
// the given template with the given menu items passed
// to the template as an items array. Each item should
// include a name, link and optional current property. 
// Adds a click event handler that will intercept any 
// clicks on links whithin the view and navigate to 
// its href using the given router. You can set the 
// current menu option on the returned view by calling
// setCurrent(name). Example:
//
//   var menuView = App.makeMenu( aTemplate, [
//     {name: "home", link: "/", current: true},
//     {name: "other", link: "/other"},
//   ], App.mainRouter);
//   menuView.setCurrent("other");

App.makeMenu = function(template, items, router) {
  return new Backlift.CommonView({
    template: template,
    params: {items: items},
    events: {
      "click a": function (ev) {
        var link = $(ev.target).attr("href");
        router.navigate(link, {trigger: true});
        return false;
      }
    },
    setCurrent: function(current) {
      for (var i=0; i<this.params.items.length; i++) {
        var is_cur = this.params.items[i].name === current;
        this.params.items[i].current = is_cur;
      }
    }
  });
  
};

$(function(){
  App.mainRouter = new App.MainRouter();
  Backbone.history.start({pushState: true}); 
});