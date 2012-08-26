//  main.js
//  (c) 2012 Cole Krumbholz, SendSpree Inc.
//
//  This document may be used and distributed in accordance with 
//  the MIT license. You may obtain a copy of the license at 
//    http://www.opensource.org/licenses/mit-license.php
//
//  Depends on backlift-knockout-helpers.js
//
//  This is the knockout.js todo example, taken from the 
//  loading and saving tutorial:
//  http://learn.knockoutjs.com/#/?tutorial=loadingsaving
//  It has been altered to work with backlift. Differences
//  are called out in the comments.


// Task is now a subclass of Backlift.PersistedKnockoutObject 
// that knows how to synchronize itself with the backlift 
// backend.

var Task = Backlift.PersistedKnockoutObject.extend({

    // collection required to tell backlift where to 
    // persist this object
    collection: "tasks",

    init: function(data) {
        this._super(data); // call super init

        this.title = ko.observable(data.title);
        this.isDone = ko.observable(data.isDone);

        // send updates to the server when the object
        // is changed via knockout
        var that = this;
        this.title.subscribe(function (newValue) {
            that.save({title: newValue});
        });
        this.isDone.subscribe(function (newValue) {
            that.save({isDone: newValue});
        });        
    },
});


function TaskListViewModel() {

    var self = this;
    self.tasks = ko.observableArray([]);
    self.newTaskText = ko.observable();
    self.incompleteTasks = ko.computed(function() {
        // don't worry about _destroy since we're using backlift persistence
        return ko.utils.arrayFilter(self.tasks(), function(task) { return !task.isDone() });
    });

    self.addTask = function() {
        var newTask = new Task({ title: this.newTaskText() });
        self.tasks.push(newTask);
        self.newTaskText("");
        // Persist the new task to backlift
        newTask.save();
    };

    self.removeTask = function(task) { 
        // instead of using observableArray.destroy(), just remove the task locally
        self.tasks.remove(task);
        // then call destroy() on the PersistedKnockoutObject to remove from backlift
        task.destroy();
    };

    // Use the /backliftapp/ url to load from a backlift collection
    $.getJSON("/backliftapp/tasks", function(allData) {
        var mappedTasks = $.map(allData, function(item) { return new Task(item); });
        self.tasks(mappedTasks);
    });    
}


$(function() {
    ko.applyBindings(new TaskListViewModel());
});
