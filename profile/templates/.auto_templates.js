define(["handlebars","text!profile/templates/ChangePassword.html","text!profile/templates/Profile.html","text!profile/templates/ProfileWorkspace.html","text!profile/templates/partials/placeholder.html","text!profile/templates/placeholder.html"], function (Handlebars,arg0,arg1,arg2,arg3,arg4) {
	return {
		"profile/ChangePassword": Handlebars.compile(arg0),
		"profile/Profile": Handlebars.compile(arg1),
		"profile/ProfileWorkspace": Handlebars.compile(arg2),
		"profile/partials/placeholder": Handlebars.compile(arg3),
		"profile/placeholder": Handlebars.compile(arg4)
	};
});