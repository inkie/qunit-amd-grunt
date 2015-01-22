define([
	'core',
	'profile/templates',
	'modelurls',
	'lmblockui',
	'lmmsgbox',
	'commons/logicmonitor/models/UserModel',
	'jq-validationEngine-en'
], function (LM, templates, modelUrls, BlockUI, MessageBox, UserModel) {

	return LM.View.extend({
		template: templates['profile/ChangePassword'],

		events: {
			'click .btn-change': '_onChangePass'
		},

		appEvents: {
		},

		initialize: function (options) {
			this.blockUI = new BlockUI();
		},

		render: function () {
			this.$el.html(this.template());
			this.$('.validationEngineContainer').validationEngine({
			});
		},

		_onChangePass: function (e) {
			var that = this;
			e.preventDefault();

			if (this.$('.validationEngineContainer').validationEngine('validate')) {
				this.blockUI.block({
				});

				var data = this.serializeForm();

				this._changePass(data, function (err) {
					that.blockUI.unBlock();
					if (!err) {
						LM.logoffUser();
						new MessageBox({
							type: 'alert',
							title: 'Password change successfully',
							width: 600,
							bodyData: {
								msg: '<p style="line-height: 1.5">You password has been changed, please ' +
									'<a href="login.html" style="font-size: 16px;">Go to log in!</a></p>',
								allowHTML: true
							}
						}).on('dialog:closing', function () {
							setTimeout(function () {
								location.href = 'login.html';
							}, 0);
						});
					} else {
						MessageBox.alert( err.status + ':' + err.errmsg, 'Error');
					}
				});
			}
		},

		_changePass: function (data, cb) {
			var loginUser = LM.getLoginUser();
			var user = new UserModel({
				password: data.password,
				id: loginUser.id
			});

			user.save(null, {
				patch: true,
				success: function (model, response) {
					cb(null, model.toJSON());
				},
				error: function (model, response) {
					cb(response);
				}
			});
		}
	});
});
