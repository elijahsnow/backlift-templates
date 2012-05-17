var ProfileModel = Backbone.Model.extend({
    urlRoot: 'backlift/profiles',
});

window.ProfileView = Backbone.View.extend({
    initialize: function() {
        this.model = new ProfileModel();
        this.model.on('change', this.render, this);
    },

    render: function() {
        this.$el.html(window.JST.profile({
            username: $.cookie('user'),
            model: this.model.toJSON(),
        }));
        return this;
    },
});