window.Tweeds = Backbone.Collection.extend({
    url: 'backlift/tweeds',
});

window.TweedListView = Backbone.View.extend({
    initialize: function() {
        this.collection.on('reset', this.render, this);
        this.collection.on('change', this.render, this);
    },
    render: function() {
        this.$el.html(window.JST.tweeds({
            username: $.cookie('user'),
            collection: this.collection,
        }));
        return this;
    },
    events: {
        'click .del': 'delTweed',
    },
    delTweed: function() {
        console.log("deltweed");
    },
});