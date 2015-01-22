define([
    'lodash',
    'jquery',
    'core',
    'commons/logicmonitor/templates',
    'lmdropdownmenu',
	'modelurls'
], function (_, $, LM, templates, DropDownMenu, modelUrls) {

    return LM.View.extend({

	    template: templates['commons/logicmonitor/TopNavBar'],

        events: {
	        'click .btn-logoff': '_onLogoff'
        },

        appEvents: {
        },

        initialize: function (options) {
	        this.user = options.user;
	        this.render();
        },

        render: function () {
	        this.$el.html(this.template({
		        user: this.user
	        }));
        },

	    _onLogoff: function () {
		    LM.logoffUser(true);
	    }
    });
});
