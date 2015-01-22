define([
	'jquery',
	'backbone',
    './views/PasswordWorkspaceView'
], function ($, Backbone, PasswordWorkspaceView) {

	return Backbone.Router.extend({
		routes: {
			'(*module)': 'showWorkspace'
		},

		initialize: function () {
		},

		showWorkspace: function (module) {
			module = module || 'send';

			if (this.appView) {
				this.appView.remove();
			}

			this.appView = new PasswordWorkspaceView({
				module: module
			});

			$('.workspace-con').append(this.appView.el);
			this.appView.render();
		}
	});
});
