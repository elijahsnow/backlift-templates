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
  },

 
  // _render_layout(contentView, menuView):
  // renders the contentView into the main page layout template
  // and optionally renders a menu into the titlebar

  _render_layout: function(contentView, menuView) {

    if (!App.layoutView) {

      // the top titlebar, may contain a menu
      App.titlebarView = new App.CommonView({
        template: JST.titlebar,
        subviews: {
          '#menu': menuView,
        }
      }); 

      // the main layout view where all content goes
      App.layoutView = new App.CommonView({
        template: JST.layout, 
        subviews: {
          '#titlebar': App.titlebarView,
          '#content': contentView,
        },
      });

      $('body').append(App.layoutView.render().el);      

    } else {
      App.layoutView.renderSubview('#content', contentView);
      App.titlebarView.renderSubview('#menu', menuView);
    }
  },


  // _make_menu: convenience function for creating a 
  // menu view

  _make_menu: function(options, current) {
    return new App.CommonView({
      template: JST.menu,
      params: {
        options: options,
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


  // landingPage: the public home page. Displayed if
  // no user is logged in

  landingPage: function () {

    var landingView = new App.CommonView({
      template: JST.landing, 
    });

    var menu = this._make_menu(['home', 'other'], 'home');

    this._render_layout(landingView, menu);
  },


  // homePage: just a redirect to the landing page

  homePage: function () {

    App.mainRouter.navigate('/', {replace: true}); 

    this.landingPage();

  },


  // otherHandler: another page
  
  otherPage: function () {

    var otherView = new App.CommonView({
      template: JST.other,
    });

    var menu = this._make_menu(['home', 'other'], 'other');

    this._render_layout(otherView, menu);
  },

});


$(function(){
  App.mainRouter = new App.MainRouter();
  Backbone.history.start({pushState: true}); 
});