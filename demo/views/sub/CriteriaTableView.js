define([
	'core',
	'demo/templates',
	'./MyCriteriaTable',
	'lmmsgbox'
], function (LM, templates,  MyCriteriaTable, MessageBox) {
	return LM.View.extend({
		className: 'page-wrapper',

		events: {
			'click #btnGetData': '_getData',
			'click #btnGetDeltaData': '_getDeltaData'
		},

		template: templates['demo/CriteriaTable'],

		initialize: function () {

		},

		render: function () {
			this.$el.html(this.template());

			this.registerComponent('criteria', new MyCriteriaTable({
				data: [
					{
						id: 2,
						name: 'ui1',
						description: 'ui1 description',
						datasource: 'datasource1'
					},
					{
						id: 4,
						name: 'ui2',
						description: 'ui2 description',
						datasource: 'datasource2'
					},
					{
						id: 5,
						name: 'ui3',
						description: 'ui3 description',
						datasource: 'datasource3'
					}
				],
				pagerLabel: 'items',
				deleteConfirm: true
			}), '.criteria-table-con');
		},

		_getData: function () {
			var criteriaTable = this.getComponent('criteria');

			MessageBox.alert(JSON.stringify(criteriaTable.getFullData()));

		},

		_getDeltaData: function () {
			var criteriaTable = this.getComponent('criteria');

			MessageBox.alert(JSON.stringify(criteriaTable.getDeltaData()));

		}
	});
});
