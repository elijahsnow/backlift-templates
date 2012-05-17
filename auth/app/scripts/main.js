
var LayoutView = Backbone.View.extend({
    initialize: function(subviews) {
        this.subviews = subviews;
    },
    render: function() {
        this.$el.html(window.JST.layout());
        for (s in this.subviews) {
            this.$(s).html(this.subviews[s].render().el);
        }
        return this;
    },
});

var PageView = Backbone.View.extend({
    initialize: function(template, params) {
        this.template = template;
        this.params = params;
    },
    render: function() {
        this.$el.html(this.template(this.params));
        return this;
    },
});

var MainRouter = Backbone.Router.extend({
    routes: {
        "": "homeHandler",
        "profile": "profileHandler",
    },

    homeHandler: function () {
        $('body').empty();
        var navView = new window.NavView();
        var homeView = new window.PageView(window.JST.home, {});
        var layoutView = new LayoutView({
            '#nav': navView,
            '#content': homeView,
        });
        $('body').append(layoutView.render().el);
    },

    profileHandler: function () {
        $('body').empty();
        var navView = new window.NavView();
        var profileView = new window.ProfileView();
        var layoutView = new LayoutView({
            '#nav': navView,
            '#content': profileView,
        });
        $('body').append(layoutView.render().el);
 
        var loginView = new window.BackliftLoginRegisterView(profileView.model); 
        loginView.loginOrFetch();

        profileView.model.on('change', navView.render, navView);
    },
});

$(function(){
    window.App = new MainRouter();
    Backbone.history.start(); 
});