window.NavView = Backbone.View.extend({
    render: function() {
        this.$el.html(window.JST.nav({
            username: $.cookie('user'),
        }));
        return this;
    },
});