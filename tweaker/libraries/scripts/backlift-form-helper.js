
(function(){

  // Backlift namespace boilerplate.
  // Initialization and namespacing technique taken from Backbone.js.
  // See source of backbone at http://documentcloud.github.com/backbone
  if (typeof Backlift === 'undefined') {
    var root = this;
    var Backlift;
    if (typeof exports !== 'undefined') {
      Backlift = exports;
    } else {
      Backlift = root.Backlift = {};
    }
  }

  // Backlift.handleFormErrors:
  // Will automatically display errors on your forms if you use the following
  // conventions:
  //
  // - Each form input should have a parent tag with an id that matches the 
  //   input's name attribute. (the 'group tag')
  // - Each group tag should have a child of the class 'errors'. This is where
  //   that input field's errors will be listed. It should be empty.
  // - A sibling of the group tags should have the id 'form_errors'. This is
  //   where general form errors will be listed. It should be empty.
  //
  // Here is an example:
  //
  //   <form>
  //     <div id="myfield">
  //       <label>myfield <span class="errors"></span>
  //       <input name="myfield" type="text"></label>
  //     </div>
  //     <div id="form_errors"></div>
  //     <input type="submit">
  //   </form>
  // 
  // Arguments:
  //   view: the Backbone.js View object that contains the form.
  //   data: an object returned by backlift containing form errors. Typically
  //     this is provided by an error event.
  //   prefix: (optional) a prefix that will modify jquery searches for the 
  //     group tags and 'form_errors' tag. For example, passing 'my' as the 
  //     prefix to a form with a 'message' field will modify elements that 
  //     match '#my_message .errors' and '#my_form_errors'
  // 
  // Backlift.handleFormErrors should be called in response to an 'error' 
  // event. For example, in a Backbone view's initialization, you could use 
  // the following statement:
  // 
  //   this.model.on('error', function(model, response, params) {
  //     Backlift.handleFormErrors(this, response);
  //   }, this);
  //
  Backlift.handleFormErrors = function (view, response, prefix) 
  {
    if (typeof prefix === 'string') {
      prefix += "_";
    } else {
      prefix = "";
    }

    var data = jQuery.parseJSON(response.responseText);

    if (data && 'form_errors' in data) {
      for (key in data.form_errors) {
        var tag;
        if (key == '') {
          tag = "#"+prefix+"form_errors";
        } else {
          tag = "#"+prefix+key+" .errors";
          view.$("#"+prefix+key).addClass('error')
        }
        for (error in data.form_errors[key]) {
          view.$(tag).append(data.form_errors[key][error]+" ");
        }
      }
    }       
  };

  // Backlift.cleanupFormErrors
  Backlift.cleanupFormErrors = function (view, prefix) 
  {
    if (typeof prefix === 'string') {
      prefix += "_";
    } else {
      prefix = "";
    }
    view.$('[id^="'+prefix+'"]').removeClass('error');
    view.$('[id^="'+prefix+'"] .errors').empty();
    view.$('#'+prefix+'form_errors').empty();    
  };

}).call(this);


// JQuery serializeObject helper by Tobais Cohen
// http://stackoverflow.com/questions/1184624/convert-form-data-to-js-object-with-jquery
$.fn.serializeObject = function()
{
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });
  return o;
};

// Backbone._backlift_form_helper_sync_base = Backbone.sync;

// Backbone.sync = function(method, model, options) {
//   var error_param = options.error;
//   options.error = function(obj, jqXHR) {
//     var response = jQuery.parseJSON(jqXHR.responseText);
//     model.trigger("error", jqXHR.status, response);
//     if (typeof error != 'undefined') {
//       error_param(obj, jqXHR);
//     }
//   }
//   Backbone._backlift_form_helper_sync_base(method, model, options);
// };


