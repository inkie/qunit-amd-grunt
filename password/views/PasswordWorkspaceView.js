define([
	'core',
	'password/templates',
	'modelurls',
	'lmblockui',
	'lmmsgbox',
	'./SendLinkView',
	'./ResetPasswordView'
], function (LM, templates, modelUrls, BlockUI, MessageBox, SendLinkView, ResetPasswordView) {

	return LM.View.extend({
		className: 'workspace password-workspace',

		template: templates['password/PasswordWorkspace'],

		events: {
		},

		appEvents: {
		},

		initialize: function (options) {
			this.module = options.module;
			this.blockUI = new BlockUI();
		},

		render: function () {
			var module = this.module;

			this.$el.html(this.template());

			if (module == 'reset') {
				this.registerComponent('sub', new ResetPasswordView(), '.sub-con');
			} else {
				this.registerComponent('sub', new SendLinkView(), '.sub-con');
			}
		}
	});
});
