define([
	'core',
	'jquery',
	'demo/templates',
	'commons/logicmonitor/templates',
	'lmfilterbar',
	'lmcheckboxdropdown',
	'lmradiodropdown',
	'lmautocompletedropdown'
], function (LM, $, templates, commonTemplates, FilterBar, FilterCheckBoxDropDown, FilterRadioDropDown, FilterAutoCompleteDropDown) {
	return LM.View.extend({
		className: 'page-wrapper',

		events: {
		},

		template: templates['demo/FilterBar'],

		initialize: function () {
		},

		render: function () {
			this.$el.html(this.template());

			this.registerComponent('filterBar1', new FilterBar({
				filterLabel: 'Severity:',
				defaultText: 'All',
				dropDownClass: FilterCheckBoxDropDown,
				dropDownOptions: {
					template: commonTemplates['commons/logicmonitor/filterbar/SeverityDropDown'],
					position: 'left',
					appendTo: $('.page-wrapper')
				}
			}), '.filter-bar-con');

			this.registerComponent('filterBar2', new FilterBar({
				filterLabel: 'Acknowleged:',
				defaultText: 'All',
				initText: 'No',
				dropDownClass: FilterRadioDropDown,
				dropDownOptions: {
					template: commonTemplates['commons/logicmonitor/filterbar/AllYesNoDropDown'],
					position: 'left',
					appendTo: $('.page-wrapper'),
					templateData: {selected: 'no'}
				}
			}), '.filter-bar-con');

			this.registerComponent('filterBar3', new FilterBar({
				filterLabel: 'Group:',
				defaultText: 'All',
				hideActiveLabel: true,
				dropDownClass: FilterAutoCompleteDropDown,
				dropDownOptions: {
					position: 'left',
					appendTo: $('.page-wrapper'),
					autoCompleteParams: {
						source: ['hello1', 'hello2', 'hello3'],
						isRest: false
					}
				}
			}), '.filter-bar-con');
		}
	});
});
