define(["handlebars","text!index/templates/IndexWorkspace.html","text!index/templates/partials/placeholder.html","text!index/templates/placeholder.html"], function (Handlebars,arg0,arg1,arg2) {
	return {
		"index/IndexWorkspace": Handlebars.compile(arg0),
		"index/partials/placeholder": Handlebars.compile(arg1),
		"index/placeholder": Handlebars.compile(arg2)
	};
});