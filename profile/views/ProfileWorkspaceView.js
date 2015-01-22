define([
	'core',
	'profile/templates',
	'modelurls',
	'lmblockui',
	'lmmsgbox',
	'./ProfileView',
	'./ChangePasswordView',
	'commons/logicmonitor/models/UserModel'
], function (LM, templates, modelUrls, BlockUI, MessageBox, ProfileView, ChangePasswordView, UserModel) {

	return LM.View.extend({
		className: 'workspace profile-workspace',

		template: templates['profile/ProfileWorkspace'],

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

			if (module == 'change-password') {
				this.registerComponent('sub', new ChangePasswordView(), '.sub-con');
			} else {
				var userModel = new UserModel(LM.getLoginUser());
				this.registerComponent('sub', new ProfileView({
					model: userModel
				}), '.sub-con');
				userModel.fetch();
			}
		}
	});
});
