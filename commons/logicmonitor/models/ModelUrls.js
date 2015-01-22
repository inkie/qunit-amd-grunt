/**
 * This file is used to config the model urls, all urls should config in this file for central management
 */
define([
    'lodash',
    'utils',
	'core'
], function(_, utils, LM) {
	var apiRoot = LM.apiRoot;

	return {
		'users': apiRoot + '/users',
		'login': apiRoot + '/users/login',
		'logoff': function (userId) {
			return apiRoot + '/users/' + userId + '/logoff';
		},
		'forgotpass': apiRoot + '/users/forgotpass',
		'resetpass': apiRoot + '/users/resetpass',
        'debug': apiRoot + '/debug/'
	};
});
