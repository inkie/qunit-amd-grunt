define([
	'core',
	'login/templates',
	'modelurls',
	'lmmsgbox',
	'lmblockui'
], function (LM, templates, modelUrls, MessageBox, BlockUI) {

	return LM.View.extend({
		className: 'workspace login-workspace',

		template: templates['login/LoginWorkspace'],

		events: {
			'click .btn-login': '_onLogin'
		},

		appEvents: {
		},

		initialize: function (options) {
			this.module = options.module;
			this.blockUI = new BlockUI();
		},

		render: function () {
			var module = this.module;

			this.$el.html(this.template({
				activateSuccess: (location.search || '').indexOf('activate_success') > -1
			}));
		},

		_onLogin: function (e) {
			e.preventDefault();
			var that = this;
			var data = this.serializeForm();

			this.blockUI.block({
				message: 'Log in...'
			});

			this._login(data, function (err, userData) {
				that.blockUI.unBlock();
				if (!err) {
					// Storage the user data in localstorage
					LM.setLoginUser(userData, data.rem);
					location.href = 'index.html';
				} else {
					MessageBox.alert( err.status + ':' + err.errmsg, 'Log in error');
				}

			});
		},

		_login: function (data, cb) {
			LM.rajax({
				type: 'post',
				url: modelUrls.login,
				data: JSON.stringify({
					username: data.username,
					password: data.password
				}),
				success: function (response) {
					cb(null, response.data);
				},
				error: function (response) {
					cb(response);
				}
			});
		}
	});
});
