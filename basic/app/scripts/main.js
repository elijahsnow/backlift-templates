// Copyright (c) 2012 SendSpree Inc.
// 
// Permission is hereby granted, free of charge, to any person obtaining 
// a copy of this software and associated documentation files (the 
// "Software"), to deal in the Software without restriction, including 
// without limitation the rights to use, copy, modify, merge, publish, 
// distribute, sublicense, and/or sell copies of the Software, and to 
// permit persons to whom the Software is furnished to do so, subject 
// to the following conditions:
// 
// The above copyright notice and this permission notice shall be 
// included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY 
// CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var MainView = Backbone.View.extend({
    render: function() {
        
        // Render the main.jst template.
        var content = window.JST.main({
            app_id: window.backlift_app_id
        }); 

        // add the content to the DOM
        this.$el.html(content);

        // // UNCOMMENT ME TO ENABLE DINOSAUR TRACKS!
        // var tracksview = new window.TracksView();
        // this.$('#tracks-container').html(tracksview.render().el);

        return this;
    },
});

// MainRouter: This simple example only has one page. More
// complex sites will include additional routes for each
// page on the website.
var MainRouter = Backbone.Router.extend({
    routes: {
        "": "handleHome",
    },

    handleHome: function() {
        // render the main view into the body of the page
        var mainView = new MainView();
        $('body').empty();
        $('body').append(mainView.render().el);
    },
});

$(function() {
    var App = new MainRouter();
    Backbone.history.start(); 
});
