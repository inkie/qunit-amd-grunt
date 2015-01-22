define([
	'jquery',
	'backbone',
    './views/ProfileWorkspaceView'
], function ($, Backbone, ProfileWorkspaceView) {

	return Backbone.Router.extend({
		routes: {
			'(*module)': 'showWorkspace'
		},

		initialize: function () {
		},

		showWorkspace: function (module) {
			module = module || 'profile';

			if (this.appView) {
				this.appView.remove();
			}

			this.appView = new ProfileWorkspaceView({
				module: module
			});

			$('.workspace-con').append(this.appView.el);
			this.appView.render();
		}
	});
});
