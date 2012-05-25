Backlift.LoginView = Backbone.View.extend({

	login_form: ""
	+ "<div class='modal hide fade' id='login_modal'>"
	+ "  <div class='modal-header'>"
	+ "    <h3 style='margin-left: 10px'>Please Sign-in</h3>"
	+ "  </div>"
	+ "  <div class='modal-body'>"
	+ "    <div class='row'><div class='span3' style='margin-left: 30px'>"
	+ "	     <form class='form' style='margin:0' id='login_form' action='/auth/login' method='POST'>"
	+ "      <div id='login_form_errors' style='color:red'></div>"
	+ "	     <input type='hidden' name='next' value='/admin-emails.html'>"

	+ "		 <div class='control-group' id='login_username'>"
	+ "	       <label class='control-label'>username  <span class='errors'></span>"
	+ "        <input type='text' name='username'/></label>"
	+ "		 </div>"

	+ "		 <div class='control-group' id='login_password'>"
	+ "	       <label class='control-label'>password <span class='errors'></span>"
	+ "        <input type='password' name='password'/></label>"
	+ "		 </div>"

	+ "	     <input type='submit' style='margin-top:18px' id='login-submit' class='btn btn-primary'>"
	+ "	     </form>"
	+ "    </div></div>"
	+ "  </div>"
	+ "</div>",

	initialize: function(userModel) {
		$('body').append(this.render().el);
		this.userModel = userModel;
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
			that.hide();
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
			url: '/auth/login',
			data: $('#login_form').serialize(),
			success: this._make_success_fn(),
			error: this._make_error_fn("login"),
		});
		return false;
    },

    show: function() {
	    $('#login_modal').modal({
	        keyboard: false,
	        backdrop: 'static',
	        show: true
	    });
    },

    hide: function() {
	    $('#login_modal').modal('hide');
    },

    fetchUserModel: function() {
        if (!$.cookie('user')) {
            this.show();
        } else {
            if (this.userModel.isNew()) {
            	this.userModel.id = $.cookie('user');
            }
            this.userModel.fetch({
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
	+ "	     <form class='form' style='margin:0' id='login_form' action='/auth/login' method='POST'>"
	+ "      <div id='login_form_errors' style='color:red'></div>"
	+ "	     <input type='hidden' name='next' value='/admin-emails.html'>"

	+ "		 <div class='control-group' id='login_username'>"
	+ "	       <label class='control-label'>username  <span class='errors'></span>"
	+ "        <input type='text' name='username'/></label>"
	+ "		 </div>"

	+ "		 <div class='control-group' id='login_password'>"
	+ "	       <label class='control-label'>password  <span class='errors'></span>"
	+ "        <input type='password' name='password'/></label>"
	+ "		 </div>"

	+ "	     <input type='submit' style='margin-top:18px' id='login-submit' class='btn btn-primary'>"
	+ "	     </form>"

	+ "    </div><div class='span3' style='margin-left: 70px'>"
	+ "      <h4 style='margin-bottom: 10px'>Create new account</h4>"
	+ "	     <form class='form' style='margin:0' id='register_form' action='/auth/register' method='POST'>"
	+ "      <div id='register_form_errors' style='color:red'></div>"
	+ "	     <input type='hidden' name='next' value='/admin-emails.html'>"

	+ "		 <div class='control-group' id='register_username'>"
	+ "	       <label class='control-label'>username  <span class='errors'></span>"
	+ "        <input type='text' name='username'/></label>"
	+ "		 </div>"

	+ "		 <div class='control-group' id='register_password'>"
	+ "	       <label class='control-label'>password  <span class='errors'></span>"
	+ "        <input type='password' name='password'/></label>"
	+ "		 </div>"

	+ "		 <div class='control-group' id='register_password2'>"
	+ "	       <label class='control-label'>password (again) <span class='errors'></span>"
	+ "        <input type='password' name='password2'/></label>"
	+ "		 </div>"

	+ "	     <input type='submit' style='margin-top:18px' id='register-submit' class='btn btn-primary'>"
	+ "	     </form>"
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
			url: '/auth/register',
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
