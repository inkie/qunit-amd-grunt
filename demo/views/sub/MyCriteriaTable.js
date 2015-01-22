define([
	'core',
	'lmcriteriatable',
	'demo/templates',
	'jq-validationEngine-en'
], function (LM, CriteriaTable, templates) {
	return CriteriaTable.extend({
		className: 'lm-table lm-expand-table lm-criteria-table',

		events: {
		},

		template: templates['demo/MyCriteriaTable'],

		rowTemplate: templates['demo/partials/MyCriteriaTableRow'],

		getRowData: function ($tr) {
			return {
				id: $tr.find('.col-id input').val(),
				name: $.trim($tr.find('.col-name input').val()),
				description: $tr.find('.col-description input').val(),
				datasource: $.trim($tr.find('.col-datasource input').val())
			};
		},

		beforeCloneData: function (cloneData) {
			return cloneData;
		},

		validateDataRow: function ($tr) {
			if (!$tr.find('td:first input').val()) {
				$tr.find('td:first input').validationEngine('showPrompt', 'Name is required', 'warn', 'topLeft', true);
				return false;
			} else {
				return true;
			}
		}
	});
});
