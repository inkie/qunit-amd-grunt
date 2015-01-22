define(["handlebars","text!debug/templates/DebugWorkspace.html","text!debug/templates/partials/placeholder.html","text!debug/templates/placeholder.html"], function (Handlebars,arg0,arg1,arg2) {
	return {
		"debug/DebugWorkspace": Handlebars.compile(arg0),
		"debug/partials/placeholder": Handlebars.compile(arg1),
		"debug/placeholder": Handlebars.compile(arg2)
	};
});