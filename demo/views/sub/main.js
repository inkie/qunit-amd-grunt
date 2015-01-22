/**
 * sub package
 */
define([
    './AutoCompleteView',
	'./ButtonsView',
	'./BlockUIView',
	'./CriteriaTableView',
	'./DropDownView',
	'./DropDownMenuView',
	'./DialogView',
    './FilterBarView',
	'./FormControlsView',
    './expandTable/ExpandTableView',
    './InfoTableView',
    './PagerView'
], function (AutoCompleteView, ButtonsView, BlockUIView, CriteriaTableView, DropDownView, DropDownMenuView,
  DialogView, FilterBarView, FormControlsView, ExpandTableView, InfoTableView, PagerView) {
    return {
        'auto-complete': AutoCompleteView,
        'buttons': ButtonsView,
        'block-ui': BlockUIView,
        'criteria-table': CriteriaTableView,
        'dropdown': DropDownView,
        'dropdown-menu': DropDownMenuView,
        'dialog': DialogView,
        'filter-bar': FilterBarView,
        'form-controls': FormControlsView,
        'expand-table': ExpandTableView,
        'info-table': InfoTableView,
        'pager': PagerView
    };
});
