
var LayoutView = Backbone.View.extend({
    initialize: function(template, params, subviews) {
        this.template = template;
        this.params = params;
        this.subviews = subviews;
    },
    render: function() {
        this.$el.html(this.template(this.params));
        for (s in this.subviews) {
            this.$(s).html(this.subviews[s].el);
        }
        return this;
    },
});

var MainRouter = Backbone.Router.extend({
    routes: {
        "": "homeHandler",
        "profile": "profileHandler",
    },

    homeHandler: function () {
        if ($.cookie('user')) {
            return this.profileHandler();
        }

        $('body').empty();

        var navView = new window.NavView();
        var tweakListView = new window.TweedListView({
            collection: window.tweeds
        });

        var homeView = new LayoutView(
            window.JST.home, 
            { collection: window.tweeds, },
            { '#tweaks': tweakListView, });

        var layoutView = new LayoutView(
            window.JST.layout, {}, {
                '#nav': navView,
                '#content': homeView,
            });

        $('body').append(layoutView.el);

        layoutView.render();
        homeView.render();
        navView.render();
    },

    profileHandler: function () {
        $('body').empty();
        var navView = new window.NavView();
        var profileView = new window.UserView(window.tweeds);
        var layoutView = new LayoutView(window.JST.layout, {}, {
            '#nav': navView,
            '#content': profileView,
        });
        $('body').append(layoutView.el);

        layoutView.render();
        if ($.cookie('user')) navView.render();
        profileView.model.on('change', navView.render, navView);

        var loginView = new Backlift.LoginRegisterView(profileView.model); 
        loginView.fetchUserModel();
    },
});

$(function(){
    window.tweeds = new window.Tweeds();
    window.tweeds.fetch({data: {latest: 30}});
    window.App = new MainRouter();
    Backbone.history.start(); 
});