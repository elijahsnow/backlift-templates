//  backlift-helpers.js
//  (c) 2012 Cole Krumbholz, SendSpree Inc.
//
//  This document may be used and distributed in accordance with 
//  the MIT license. You may obtain a copy of the license at 
//    http://www.opensource.org/licenses/mit-license.php

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
  //     <div id="myfield">                               <!-- // group tag -->
  //       <label>myfield <span class="errors"></span>    <!-- // errors    -->
  //       <input name="myfield" type="text"></label>
  //     </div>
  //     <div id="form_errors"></div>                     <!-- // form errs -->
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


  Backlift.LoginView = Backbone.View.extend({

    login_form: ""
    + "<div class='modal hide fade' id='login_modal'>"
    + "  <div class='modal-header'>"
    + "    <h3 style='margin-left: 10px'>Please Sign-in</h3>"
    + "  </div>"
    + "  <div class='modal-body'>"
    + "    <div class='row'><div class='span3' style='margin-left: 30px'>"
    + "      <form class='form' style='margin:0' id='login_form' action='/backlift/auth/login' method='POST'>"
    + "      <div id='login_form_errors' style='color:red'></div>"
    + "      <input type='hidden' name='next' value='/admin-emails.html'>"

    + "    <div class='control-group' id='login_username'>"
    + "        <label class='control-label'>username  <span class='errors'></span>"
    + "        <input type='text' name='username'/></label>"
    + "    </div>"

    + "    <div class='control-group' id='login_password'>"
    + "        <label class='control-label'>password <span class='errors'></span>"
    + "        <input type='password' name='password'/></label>"
    + "    </div>"

    + "      <input type='submit' style='margin-top:18px' id='login-submit' class='btn btn-primary'>"
    + "      </form>"
    + "    </div></div>"
    + "  </div>"
    + "</div>",

    initialize: function() {
      $('body').append(this.render().el);
    },

    render: function() {
      $(this.el).html(this.login_form);
      return this;
    },

    events: {
      "click #login-submit" : "_login_submitted",
    },

    _make_success_fn: function () {
      var that=this;
      return function () {
        that.fetchUserModel();
        that._hide();
      }
    },

    _make_error_fn: function (prefix) {
      var that=this;
      return function(xhr) {
        Backlift.handleFormErrors(that, xhr, prefix);
      }
    },

    _login_submitted: function () {
      var that = this;
      Backlift.cleanupFormErrors(this, "login");
      $.ajax({
        type: 'POST',
        url: '/backlift/auth/login',
        data: $('#login_form').serialize(),
        success: this._make_success_fn(),
        error: this._make_error_fn("login"),
      });
      return false;
    },

    _show: function() {
      $('#login_modal').modal({
        keyboard: false,
        backdrop: 'static',
        show: true
      });
    },

    _hide: function() {
      $('#login_modal').modal('hide');
    },

    // fetchUserModel: If user logged in fetch the user's model, or if no user
    // model exists on the server for the currently logged in user, save
    // the current model. If user not logged in, prompt them to log-in.

    fetchUserModel: function() {
      if (!$.cookie('user')) {
        this._show();
      } else {
        this.model.id = $.cookie('user');
        this.model.fetch({
          error: function (model, xhr) {
            if (xhr.status == 404) {
              model.save();
            }
          }
        });
      }
    },

  });


  Backlift.LoginRegisterView = Backlift.LoginView.extend({

    login_form: ""
    + "<div class='modal hide fade' id='login_modal'>"
    + "  <div class='modal-header'>"
    + "    <h3 style='margin-left: 10px'>Please Sign-in</h3>"
    + "  </div>"
    + "  <div class='modal-body'>"
    + "    <div class='row'><div class='span3' style='margin-left: 30px'>"
    + "      <h4 style='margin-bottom: 10px'>Use existing account</h4>"
    + "      <form class='form' style='margin:0' id='login_form' action='/backlift/auth/login' method='POST'>"
    + "      <div id='login_form_errors' style='color:red'></div>"
    + "      <input type='hidden' name='next' value='/admin-emails.html'>"

    + "    <div class='control-group' id='login_username'>"
    + "        <label class='control-label'>username  <span class='errors'></span>"
    + "        <input type='text' name='username'/></label>"
    + "    </div>"

    + "    <div class='control-group' id='login_password'>"
    + "        <label class='control-label'>password  <span class='errors'></span>"
    + "        <input type='password' name='password'/></label>"
    + "    </div>"

    + "      <input type='submit' style='margin-top:18px' id='login-submit' class='btn btn-primary'>"
    + "      </form>"

    + "    </div><div class='span3' style='margin-left: 70px'>"
    + "      <h4 style='margin-bottom: 10px'>Create new account</h4>"
    + "      <form class='form' style='margin:0' id='register_form' action='/backlift/auth/register' method='POST'>"
    + "      <div id='register_form_errors' style='color:red'></div>"
    + "      <input type='hidden' name='next' value='/admin-emails.html'>"

    + "    <div class='control-group' id='register_username'>"
    + "        <label class='control-label'>username  <span class='errors'></span>"
    + "        <input type='text' name='username'/></label>"
    + "    </div>"

    + "    <div class='control-group' id='register_password'>"
    + "        <label class='control-label'>password  <span class='errors'></span>"
    + "        <input type='password' name='password'/></label>"
    + "    </div>"

    + "    <div class='control-group' id='register_password2'>"
    + "        <label class='control-label'>password (again) <span class='errors'></span>"
    + "        <input type='password' name='password2'/></label>"
    + "    </div>"

    + "      <input type='submit' style='margin-top:18px' id='register-submit' class='btn btn-primary'>"
    + "      </form>"
    + "    </div></div>"
    + "  </div>"
    + "</div>",

    events: {
      "click #login-submit" : "_login_submitted",
      "click #register-submit" : "_register_submitted",
    },

    _register_submitted: function () {
      var that = this;
      Backlift.cleanupFormErrors(this, "login");
      Backlift.cleanupFormErrors(this, "register");
      $.ajax({
        type: 'POST',
        url: '/backlift/auth/register',
        data: $('#register_form').serialize(),
        success: this._make_success_fn(),
        error: this._make_error_fn("register"),
      });
      return false;
    },

    _login_submitted: function() {
      Backlift.cleanupFormErrors(this, "register");
      return Backlift.LoginView.prototype._login_submitted.call(this);
    },

  });

}).call(this);

