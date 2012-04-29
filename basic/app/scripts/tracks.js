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

var Tracks = Backbone.Collection.extend({
    url: 'backlift/tracks',
});

window.TracksView = Backbone.View.extend({

    className: 'tracksview',

    initialize: function() {

        // instantiate a new Tracks collection and
        // initialize it with data from the server
        this.collection = new Tracks();
        this.collection.fetch();

        // call this.render whenever the collection
        // changes
        this.collection.on('add', this.render, this);
        this.collection.on('reset', this.render, this);

        // start with the left foot
        this.lastFoot = 'right';
    },

    events: {
        'click': 'addFootprint',
    },

    addFootprint: function(ev) {

        // determin x,y offsets from the upper left
        // corner of the containing div to the center
        // of the footprint image.
        var x = ev.pageX - ev.target.offsetLeft - 25;
        var y = ev.pageY - ev.target.offsetTop - 32;

        // select left or right footprint
        var foot = 'left';
        if (this.lastFoot == 'left') {
            foot = 'right';
        }
        this.lastFoot = foot;

        this.collection.create({xpos: x+'px', ypos: y+'px', foot: foot});
    },

    render: function () {
        // render the tracks using the tracks.jst template
        var content = window.JST.tracks({
            collection: this.collection,
        });

        // add the content to the DOM
        this.$el.html(content);
        return this;
    }
});