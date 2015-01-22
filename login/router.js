define([
	'jquery',
	'backbone',
    './views/LoginWorkspaceView'
], function ($, Backbone, LoginWorkspaceView) {

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

			this.appView = new LoginWorkspaceView({
				module: module
			});

			$('.workspace-con').append(this.appView.el);
			this.appView.render();
		}
	});
});
