define([
	'core',
	'lodash',
	'profile/templates',
	'modelurls',
	'lmblockui',
	'lmmsgbox',
	'commons/logicmonitor/models/UserModel',
	'jq-validationEngine-en'
], function (LM, _, templates, modelUrls, BlockUI, MessageBox, UserModel) {

	return LM.View.extend({
		template: templates['profile/Profile'],

		events: {
			'click .btn-update': '_onUpdate'
		},

		appEvents: {
		},

		initialize: function (options) {
			this.blockUI = new BlockUI();

			this.listenTo(this.model, 'change', this.render);
		},

		render: function () {
			this.$el.html(this.template(this.model.toJSON()));

			this.$('.validationEngineContainer').validationEngine({
			});
		},

		_onUpdate: function (e) {
			e.preventDefault();
			var that = this;

			if (this.$('.validationEngineContainer').validationEngine('validate')) {
				var data = this.serializeForm();

				this.blockUI.block({
					message: 'Updating...'
				});

				this._update(data, function (err) {
					that.blockUI.unBlock();
					if (!err) {
						MessageBox.alert( 'Update user profile info successfully!', 'Update user profile');
					} else {
						MessageBox.alert( err.status + ':' + err.errmsg, 'Error');
					}
				});
			}
		},

		_update: function (data, cb) {
			this.model.save(data, {
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
