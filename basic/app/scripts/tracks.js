
var Tracks = Backbone.Collection.extend({
	model: Backbone.Model,
	url: 'backlift/tracks',
});

window.TracksView = Backbone.View.extend({

	className: 'tracksview',

	initialize: function() {
        this.collection = new Tracks();
        this.collection.fetch();

		this.collection.on('add', this.render, this);
		this.collection.on('reset', this.render, this);
		this.lastFoot = 'right';
	},

	events: {
		'click': 'addFootprint',
	},

	addFootprint: function(ev) {
		var x = ev.pageX - ev.target.offsetLeft - 25;
		var y = ev.pageY - ev.target.offsetTop - 32;

		var foot = 'left';
		if (this.lastFoot == 'left') {
			foot = 'right';
		}
		this.lastFoot = foot;

		this.collection.create({xpos: x+'px', ypos: y+'px', foot: foot});
	},

	render: function () {
		var content = window.JST.tracks({
			collection: this.collection,
		});
		$(this.el).html(content);
		return this;
	}
});