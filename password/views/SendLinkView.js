define([
	'core',
	'password/templates',
	'modelurls',
	'lmblockui',
	'lmmsgbox'
], function (LM, templates, modelUrls, BlockUI, MessageBox) {

	return LM.View.extend({
		template: templates['password/SendLink'],

		events: {
			'click .btn-send': '_onSend'
		},

		appEvents: {
		},

		initialize: function (options) {
			this.blockUI = new BlockUI();
		},

		render: function () {
			this.$el.html(this.template());
		},

		_onSend: function (e) {
			e.preventDefault();
			var that = this;
			var data = this.serializeForm();

			this.blockUI.block({
				message: 'Sending...'
			});

			this._sendLink(data, function (err) {
				that.blockUI.unBlock();
				if (!err) {
					new MessageBox({
						type: 'alert',
						title: 'Forgot password',
						width: 600,
						bodyData: {
							msg: '<p style="line-height: 1.5">The reset password link has been sent to your registered email.' +
								'The reset link will only be active for 30 minutes. After reset your password, you can ' +
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
		},

		_sendLink: function (data, cb) {
			LM.rajax({
				type: 'post',
				url: modelUrls.forgotpass,
				data: JSON.stringify({
					username: data.username
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
