define([
	'lodash',
	'core',
	'demo/templates',
	'lmdropdownmenu',
	'lmmsgbox',
	'utils'
], function (_, LM, templates,  DropDownMenu, MessageBox, utils) {
	return LM.View.extend({
		template: templates['demo/DropDownMenu'],

		appEvents: {
			'select dropDownMenu': '_onMenuSelected'
		},

		render: function () {
			this.$el.html(this.template());
			this.registerComponent('dropDownMenu', new DropDownMenu({
				triggerEl: '#openDropDownMenu',
				template: templates['demo/MenuList'],
				position: 'left'
			}));
		},

		_onMenuSelected: function (command) {
			var supportFunc = utils.camelCase(command);
			$(document).trigger('click.outside');
			if (_.isFunction(this[supportFunc])) {
				this[supportFunc]();
			};
		},

		menuOne: function () {
			MessageBox.alert('Menu one on click');
		},

		menuTwo: function () {
			MessageBox.alert('Menu two on click');
		},

		menuThree: function () {
			MessageBox.alert('Menu three on click');
		}
	});
});