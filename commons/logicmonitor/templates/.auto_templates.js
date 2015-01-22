define(["handlebars","text!commons/logicmonitor/templates/TopNavBar.html","text!commons/logicmonitor/templates/filterbar/AllYesNoDropDown.html","text!commons/logicmonitor/templates/filterbar/More.html","text!commons/logicmonitor/templates/filterbar/SeverityDropDown.html","text!commons/logicmonitor/templates/partials/foot.html","text!commons/logicmonitor/templates/partials/placeholder.html"], function (Handlebars,arg0,arg1,arg2,arg3,arg4,arg5) {
	return {
		"commons/logicmonitor/TopNavBar": Handlebars.compile(arg0),
		"commons/logicmonitor/filterbar/AllYesNoDropDown": Handlebars.compile(arg1),
		"commons/logicmonitor/filterbar/More": Handlebars.compile(arg2),
		"commons/logicmonitor/filterbar/SeverityDropDown": Handlebars.compile(arg3),
		"commons/logicmonitor/partials/foot": Handlebars.compile(arg4),
		"commons/logicmonitor/partials/placeholder": Handlebars.compile(arg5)
	};
});