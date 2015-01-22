define([
	'jquery',
	'backbone',
    './views/SignupWorkspaceView'
], function ($, Backbone, SignupWorkspaceView) {

	return Backbone.Router.extend({
		routes: {
			'(*module)': 'showWorkspace'
		},

		initialize: function () {
		},

		showWorkspace: function (module) {
			module = module || '';

			if (this.appView) {
				this.appView.remove();
			}

			this.appView = new SignupWorkspaceView({
				module: module
			});

			$('.workspace-con').append(this.appView.el);
			this.appView.render();
		}
	});
});
