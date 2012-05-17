window.BackliftLoginView = Backbone.View.extend({

	login_form: ""
	+ "<div class='modal hide fade' id='login_modal'>"
	+ "  <div class='modal-header'>"
	+ "    <h3 style='margin-left: 10px'>Please Sign-in</h3>"
	+ "  </div>"
	+ "  <div class='modal-body'>"
	+ "    <div class='row'><div class='span3' style='margin-left: 30px'>"
	// + "      <h4 style='margin-bottom: 10px'>Use existing account</h4>"
	+ "	     <form class='form' style='margin:0' id='login_form' action='/auth/login' method='POST'>"
	+ "      <div id='form_errors' style='color:red'></div>"
	+ "	     <input type='hidden' name='next' value='/admin-emails.html'>"

	+ "		 <div class='control-group' id='username'>"
	+ "	       <label class='control-label'>username  <span class='errors'></span>"
	+ "        <input type='text' name='username'/></label>"
	+ "		 </div>"

	+ "		 <div class='control-group' id='password'>"
	+ "	       <label class='control-label'>password <span class='errors'></span>"
	+ "        <input type='password' name='password'/></label>"
	+ "		 </div>"

	+ "	     <input type='submit' style='margin-top:18px' id='login-submit' class='btn btn-primary'>"
	+ "	     </form>"
	// + "    </div><div class='span3' style='margin-left: 70px'>"
	// + "      <h4 style='margin-bottom: 10px'>Create new account</h4>"
	// + "	     <form class='form' id='register_form' action='/auth/register' method='POST'>"
	// + "	     <input type='hidden' name='next' value='/admin-emails.html'>"
	// + "	     <label>username<input type='text' id='username' name='username'/></label>"
	// + "	     <label>password<input type='password' id='password1' name='password1'/></label>"
	// + "	     <label>password (again)<input type='password' id='password2' name='password2'/></label>"
	// + "	     <input type='submit' id='register-submit' class='btn btn-primary'>"
	// + "	     </form>"
	+ "    </div></div>"
	+ "  </div>"
	+ "</div>",

	initialize: function(userModel) {
		$('body').append(this.render().el);
		this.userModel = userModel;
	},

	_cleanup: function() {
		this.$('.control-group').each(function(idx) {
			$(this).removeClass('error');
		});
		this.$('.errors').empty();
		this.$('#form_errors').empty();
	},

	_parse_form_errors: function(data, container) {
    	if (data && 'form_errors' in data) {
	    	for (key in data.form_errors) {
	    		var tag;
	    		if (key == '') {
	    			tag = container+" #form_errors";
	    		} else {
	    			tag = container+" #"+key+" .errors";
	    			this.$(container+" #"+key).addClass('error')
	    		}
	    		for (error in data.form_errors[key]) {
		    		this.$(tag).append(data.form_errors[key][error]+" ");
	    		}
	    	}
    	}		
	},

    render: function() {
    	$(this.el).html(this.login_form);

    	var data = $.cookie('data');
    	if (data != null) {
    		data = $.parseJSON(unescape(data));
    	}

    	this._parse_form_errors(data);

        return this;
    },

    events: {
        "click #login-submit" : "login",
    },

    login: function () {
    	var that = this;
    	this._cleanup();
    	$.ajax({
			type: 'POST',
			url: '/auth/login',
			data: $('#login_form').serialize(),
			success: function(data) {
				that.loginOrFetch();
				that.hide();
			},
			error: function(xhr) {
				var data = $.parseJSON(xhr.responseText)
		    	that._parse_form_errors(data, '#login_form');
			},
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

    loginOrFetch: function() {
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

window.BackliftLoginRegisterView = window.BackliftLoginView.extend({

	login_form: ""
	+ "<div class='modal hide fade' id='login_modal'>"
	+ "  <div class='modal-header'>"
	+ "    <h3 style='margin-left: 10px'>Please Sign-in</h3>"
	+ "  </div>"
	+ "  <div class='modal-body'>"
	+ "    <div class='row'><div class='span3' style='margin-left: 30px'>"
	+ "      <h4 style='margin-bottom: 10px'>Use existing account</h4>"
	+ "	     <form class='form' style='margin:0' id='login_form' action='/auth/login' method='POST'>"
	+ "      <div id='form_errors' style='color:red'></div>"
	+ "	     <input type='hidden' name='next' value='/admin-emails.html'>"

	+ "		 <div class='control-group' id='username'>"
	+ "	       <label class='control-label'>username  <span class='errors'></span>"
	+ "        <input type='text' name='username'/></label>"
	+ "		 </div>"

	+ "		 <div class='control-group' id='password'>"
	+ "	       <label class='control-label'>password  <span class='errors'></span>"
	+ "        <input type='password' name='password'/></label>"
	+ "		 </div>"

	+ "	     <input type='submit' style='margin-top:18px' id='login-submit' class='btn btn-primary'>"
	+ "	     </form>"

	+ "    </div><div class='span3' style='margin-left: 70px'>"
	+ "      <h4 style='margin-bottom: 10px'>Create new account</h4>"
	+ "	     <form class='form' style='margin:0' id='register_form' action='/auth/register' method='POST'>"
	+ "      <div id='form_errors' style='color:red'></div>"
	+ "	     <input type='hidden' name='next' value='/admin-emails.html'>"

	+ "		 <div class='control-group' id='username'>"
	+ "	       <label class='control-label'>username  <span class='errors'></span>"
	+ "        <input type='text' name='username'/></label>"
	+ "		 </div>"

	+ "		 <div class='control-group' id='password'>"
	+ "	       <label class='control-label'>password  <span class='errors'></span>"
	+ "        <input type='password' name='password'/></label>"
	+ "		 </div>"

	+ "		 <div class='control-group' id='password2'>"
	+ "	       <label class='control-label'>password (again) <span class='errors'></span>"
	+ "        <input type='password' name='password2'/></label>"
	+ "		 </div>"

	// + "		 <div class='control-group' id='invitekey'>"
	// + "	       <label class='control-label'>invitation key <span class='errors'></span>"
	// + "        <input type='text' name='invitekey'/></label>"
	// + "		 </div>"

	+ "	     <input type='submit' style='margin-top:18px' id='register-submit' class='btn btn-primary'>"
	+ "	     </form>"
	+ "    </div></div>"
	+ "  </div>"
	+ "</div>",

    events: {
        "click #login-submit" : "login",
        "click #register-submit" : "register",
    },

    register: function () {
    	var that = this;
    	this._cleanup();
    	$.ajax({
			type: 'POST',
			url: '/auth/register',
			data: $('#register_form').serialize(),
			success: function(data) {
				that.loginOrFetch();
				that.hide();
			},
			error: function(xhr) {
				var data = $.parseJSON(xhr.responseText)
		    	that._parse_form_errors(data, '#register_form');
			},
		});
        return false;
    },

});
