
window.Followers = Backbone.Collection.extend({
    url: 'backlift/profiles',
});

window.FollowersView = Backbone.View.extend({

});

window.NumFollowersView = Backbone.View.extend({
	tagName: "span",
	render: function() {
		this.$el.html(this.collection.length.toString())
		return this;
	},
});