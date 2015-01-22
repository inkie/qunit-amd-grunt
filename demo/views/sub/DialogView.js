define([
	'core',
	'jquery',
	'demo/templates',
	'./dialog/SimpleDialog',
	'./dialog/DataDialog',
	'./dialog/ModelDialog'
], function (LM, $, templates, SimpleDialog, DataDialog, ModelDialog) {
	return LM.View.extend({
		className: 'page-wrapper',

		events: {
			'click #btnSimpleDlg': '_openSimpleDialog',
			'click #btnDataDlg': '_openDataDialog',
			'click #btnModelDlg': '_openModelDialog'
		},

		template: templates['demo/Dialog'],

		initialize: function () {
		},

		render: function () {
			this.$el.html(this.template());
		},

		_openSimpleDialog: function (e) {
			this.registerComponent('dialog', new SimpleDialog({
				width: 600,
				title: 'Dialog Demo'
			}));
		},

		_openDataDialog: function (e) {
			this.registerComponent('dialog', new DataDialog({
				width: 600,
				title: 'Dialog Demo',
				data: {
					msg: this.$('#data').val()
				}
			}));
		},

		_openModelDialog: function (e) {
			this.registerComponent('dialog', new ModelDialog({
				width: 600,
				title: 'Dialog Demo',
				model: new LM.Model({
					msg: 'this message comes from a model'
				})
			}));
		}
	});
});
