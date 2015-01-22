define(["handlebars","text!password/templates/PasswordWorkspace.html","text!password/templates/ResetPassword.html","text!password/templates/SendLink.html","text!password/templates/partials/placeholder.html","text!password/templates/placeholder.html"], function (Handlebars,arg0,arg1,arg2,arg3,arg4) {
	return {
		"password/PasswordWorkspace": Handlebars.compile(arg0),
		"password/ResetPassword": Handlebars.compile(arg1),
		"password/SendLink": Handlebars.compile(arg2),
		"password/partials/placeholder": Handlebars.compile(arg3),
		"password/placeholder": Handlebars.compile(arg4)
	};
});