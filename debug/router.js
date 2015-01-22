define([
	'jquery',
	'backbone',
    './views/DebugWorkspaceView'
], function ($, Backbone, DebugWorkspaceView) {

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

			this.appView = new DebugWorkspaceView({
				module: module
			});

			$('.workspace-con').append(this.appView.el);
			this.appView.render();
		}
	});
});
