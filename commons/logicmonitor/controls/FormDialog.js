/**
 * logicmonitor Dialog control
 */
define([
    'lodash',
    'core',
    'jquery',
    'backbone',
    'commons/logicmonitor/controls/templates',
	'lmdialog'
], function (_, LM, $, Backbone, templates, Dialog) {
    return Dialog.extend({

        className: 'lm-dialog lm-form-dialog',

	    footTemplate: templates['commons/logicmonitor/controls/FormDialogFoot'],

        events: {
	        'click .toggle-link': '_toggleSectionBox',
	        'click .btn-save': '_onSave',
	        'click .btn-save-close': '_onSaveClose',
	        'click .btn-clone': '_onClone',
	        'click .btn-delete': '_onDelete',
	        'click .btn-cancel': '_onCancel'
        },

	    footParams: {
		    showFootSave: true,
		    showFootClose: false,
		    showFootClone: false,
		    showFootSaveClose: false,
		    showFootDelete: false,
		    showFootCancel: false
	    },

	    initialize: function (options) {
		    var footParams = _.pick(options, 'showFootSave', 'showFootClone', 'showFootSaveClose', 'showFootDelete', 'showFootCancel', 'showFootClose');

		    if (!_.isEmpty(footParams) && !options.footParams) {
			    options.footParams = footParams;
		    }

		    this._super(options);
	    },

	    _onSave: function () {
		    console.log('form save');

	    },

	    _onSaveClose: function () {
		    console.log('form save close');
	    },

	    _onClone: function () {
		    console.log('form clone');
	    },

	    _onDelete: function () {
		    console.log('form delete');
	    },

	    _onCancel: function () {
		    this.close();
	    },

	    _toggleSectionBox: function (e) {
		    var $sectionContent = $(e.target).closest('.section-header').next('.section-content');

		    if ($sectionContent.is(':hidden')) {
			    $sectionContent.show();
		    } else {
			    $sectionContent.hide();
		    }

		    this.resetPosition();
	    }
    });
});