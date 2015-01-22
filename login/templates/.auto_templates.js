define(["handlebars","text!login/templates/LoginWorkspace.html","text!login/templates/partials/placeholder.html","text!login/templates/placeholder.html"], function (Handlebars,arg0,arg1,arg2) {
	return {
		"login/LoginWorkspace": Handlebars.compile(arg0),
		"login/partials/placeholder": Handlebars.compile(arg1),
		"login/placeholder": Handlebars.compile(arg2)
	};
});