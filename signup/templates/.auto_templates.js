define(["handlebars","text!signup/templates/SignupWorkspace.html","text!signup/templates/partials/placeholder.html","text!signup/templates/placeholder.html"], function (Handlebars,arg0,arg1,arg2) {
	return {
		"signup/SignupWorkspace": Handlebars.compile(arg0),
		"signup/partials/placeholder": Handlebars.compile(arg1),
		"signup/placeholder": Handlebars.compile(arg2)
	};
});