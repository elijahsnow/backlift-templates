window.UserModel = Backbone.Model.extend({
    urlRoot: 'backlift/profiles',
});

window.UserView = Backbone.View.extend({
    initialize: function(tweedList) {
        // models
        this.model = new window.UserModel();
        this.followers = new window.Followers();

        // views
        this.tweedListView = new window.TweedListView({
            collection: tweedList,
        });
        this.followerCountView = new window.NumFollowersView({
            collection: this.followers,
        });

        // events
        this.model.on('change', this.userModelFetched, this);
        this.tweedListView.collection.on('error', 
            function(status, response) {
                Backlift.handleFormErrors(this, response);
            }, this);
    },

    userModelFetched: function(userModel) {
        var that = this;
        this.followers.fetch({ success: function(col) {
            // testing followers:
            col.models[0].set({following: ['test']});
            var toremove = new Array();
            col.map(function(item) {
                var isfol = _.indexOf(item.get('following'),
                                      $.cookie('user')) >= 0;
                if (!isfol) toremove.push(item);
            });
            for (var i in toremove) {
                col.remove(toremove[i], {silent:true});
            }
            that.followerCountView.render();
        }});
        this.render();
    },

    render: function() {
        this.$el.html(window.JST.profile({
            username: $.cookie('user'),
            model: this.model.toJSON(),
            tweakCount: this.tweedListView.collection.length,
        }));

        this.$('#tweaks').html(this.tweedListView.render().el);
        this.$('#folcount').html(this.followerCountView.render().el);
        this.tweedListView.delegateEvents();

        return this;
    },

    events: {
        'click #add-tweed': 'addTweed',
    },

    addTweed: function(e) {
        // creating an object. Certain values, such as the _created time and 
        // _owner are set by the server, so {wait: true} is passed in order
        // to wait for the server response before triggering the add event
        var newTweed = new Backbone.Model({message: $('#new-tweed').val()});
        this.tweedListView.collection.add(newTweed);
        newTweed.save();

        return false;
    },
});