var MainView = Backbone.View.extend({
    render: function() 
    {
        var content = window.JST.main({app_id: window.backlift_app_id});
        $('body').html(content);

        // UNCOMMENT ME TO ENABLE DINOSAUR TRACKS!
        // var tracksview = new window.TracksView();
        // $('#tracks-container').html(tracksview.render().el);

        return this;
    },
});

$(function(){
    var mv = new MainView();
    mv.render();    
});
