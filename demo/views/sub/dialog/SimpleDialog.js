define([
	'core',
	'jquery',
	'demo/templates',
	'lmdialog'
], function (LM, $, templates, Dialog) {
	return Dialog.extend({
		template: templates['demo/dialog/SimpleDialog']
	});
});
