
var MainView = Backbone.View.extend({
    render: function() {
        var content = window.JST.main();
        $('body').html(content);
        return this;
    },
});

$(function(){
    var mv = new MainView();
    mv.render();    
});
