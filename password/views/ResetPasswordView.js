define([
	'core',
	'password/templates',
	'modelurls',
	'lmblockui',
	'lmmsgbox',
	'jq-validationEngine-en'
], function (LM, templates, modelUrls, BlockUI, MessageBox) {

	return LM.View.extend({
		template: templates['password/ResetPassword'],

		events: {
			'click .btn-confirm': '_onConfirm'
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

		_onConfirm: function (e) {
			var that = this;
			e.preventDefault();


			if (this.$('.validationEngineContainer').validationEngine('validate')) {
				this.blockUI.block({
				});

				var data = this.serializeForm();

				this._confirm(data, function (err) {
					that.blockUI.unBlock();

					if (!err) {
						new MessageBox({
							type: 'alert',
							title: 'Password reset',
							width: 600,
							bodyData: {
								msg: '<p style="line-height: 1.5">You password has been reset, please ' +
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

		_confirm: function (data, cb) {
			LM.rajax({
				type: 'post',
				url: modelUrls.resetpass + location.search,
				data: JSON.stringify({
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
