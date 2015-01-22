/**
 * Create a global namespace 'LM', all global variables should put into this namespace
 */
define([
	'jquery',
	'b2',
    'lodash',
    'utils',
	'backbone',
    'es5-shim'
], function($, B2, _, utils, Backbone) {

    /**
     * localStorage namespace define:
     * localStorage.lm           global
     * localStorage.demo         demo page
     */
	var localStorage = {};
	var sessionStorage = {};


	// Use try catch in case in some special browsers, there will be exception when we refer to window.localStorage
	try {
		localStorage = window.localStorage || {};
		sessionStorage = window.sessionStorage || {};
	} catch(e) {
	}

	var projectName = 'tpl1024';

    var LM = window.LM || {
        localStorage: localStorage,
	    sessionStorage: sessionStorage,
	    projectName: projectName,
	    apiRoot: '/' + projectName + '/rest',
	    passRemTime: 30 * 24 * 3600 * 1000,
	    sessionTimeout:  30 * 60 * 1000
     };

	LM.toLoginPage = function () {
		// Use try catch in case there is cross-domain(security) problems
		try {
			window.top.location.href = 'login.html';
		} catch (e) {
			alert('Unauthorized, please relogin.');
		}
	};

	LM.logoffUser = function (goToLogin) {
		localStorage.securityUser = '';
		sessionStorage.securityUser = '';
		sessionStorage.__debug__ = 0;
		if (goToLogin) {
			LM.toLoginPage();
		}
	};

	LM.getLoginUser = function () {
		var user = null;
		var curTime = new Date().getTime();

		try {
			user = JSON.parse(localStorage.securityUser || sessionStorage.securityUser);

			if (user.username && user.securityToken && user.timestamp && user.activeTimestamp) {
				if (user.rem) {
					if ((curTime > user.timestamp && curTime - user.timestamp < LM.passRemTime) ||
						(curTime > user.activeTimestamp && curTime - user.activeTimestamp < LM.sessionTimeout)) {
						user = user;
					} else {
						user = null;
					}
				} else {
					if (curTime > user.activeTimestamp && curTime - user.activeTimestamp < LM.sessionTimeout) {
						user = user;
					} else {
						user = null;
					}
				}
			} else {
				user = null;
			}
		} catch (e) {

		}

		if (user == null) {
			if (sessionStorage.__debug__ == '1' || /debug=1/.test(location.search)) { // the debug flag
				sessionStorage.__debug__ = 1;
				user = sessionStorage.securityUser = JSON.stringify({
					id: '__debug__',
					username: 'test-user',
					securityToken: 'xxxxx',
					timestamp: curTime,
					activeTimestamp: curTime
				});
			} else {
				localStorage.securityUser = '';
				sessionStorage.securityUser = '';
			}
		} else {
			if (sessionStorage.__debug__ != '1' && !/debug=1/.test(location.search) && user.id == '__debug__') {
				sessionStorage.securityUser = '';
				localStorage.securityUser = '';
				user = null;
			}
		}

		return user;
	};

	LM.setLoginUser = function (userData, isRem) {
		var timestamp = new Date().getTime();
		var data = JSON.stringify({
			username: userData.username,
			id: userData.id,
			securityToken: userData.securityToken,
			timestamp:  userData.timestamp || timestamp,
			activeTimestamp: userData.activeTimestamp || timestamp,
			rem: !!isRem
		});

		if (isRem) {
			LM.localStorage.securityUser = data;
			LM.sessionStorage.securityUser = '';
		} else {
			LM.localStorage.securityUser = '';
			LM.sessionStorage.securityUser = data;
		}
	};


	LM.refreshActiveTimestamp = function (timestamp) {
		var timestamp = timestamp || new Date().getTime();

		var loginUser = LM.getLoginUser();

		if (loginUser) {
			loginUser.activeTimestamp = timestamp;
			LM.setLoginUser(loginUser, loginUser.rem);
			return true;
		}

		return false;
	};

	$(document.body).on('mousemove.sessionActive', _.throttle(function () {
		var page = /\/([^\/]*?)\.html/.exec(window.location.pathname);

		if (!page || !page[1]) {
			page = ['', 'index'];
		}

		page = page[1];

		if(!LM.refreshActiveTimestamp() && page != 'login' && page != 'password' && page != 'signup') {
			$(document.body).off('mousemove.sessionActive');
			require(['lmmsgbox'], function (MessageBox) {
				MessageBox.alert('You have no activities for ' + Math.round(LM.sessionTimeout / 60000) + ' minutes, Please login again!').on('dialog:closing', function () {
					setTimeout(function () {
						location.href = 'login.html';
					}, 0);
				});
			});
		}
	}, 300));

	LM.utils = utils;

    /**
     * We are JSP shop so the default underscore interpolate separator "<%=" and
     * evaluate separator "<%" don't work. This code below set them to "{{=" and
     * "{{", respectively.
     */
    _.templateSettings = {
        interpolate: /\{\{\=(.+?)\}\}/g,
        evaluate: /\{\{(.+?)\}\}/g
    };

    /**
     * Enter keycode
     */
    LM.ENTER_KEY = 13;
    LM.TAB_KEY   = 9;


	/**
	 * Define LM.rajax and rewrite Backbone.ajax
	 * LM.rajax contains the authorization logics with the Rest API, so, if you use Rest API, please make sure to
	 * call LM.rajax
	 * @type {rajax}
	 */
	Backbone.ajax = LM.rajax = function (options) {
		var timeStamp = new Date().getTime() - (window.timeStampDelta || 0);

		options.url = utils.buildUrl(options.url, {
			timestamp: timeStamp
		});

		options.dataType = options.dataType || 'json';

		if(options.contentType === false){
			options.contentType = false;
		} else {
			options.contentType = options.contentType || 'application/json';
		}

		options.cache = options.cache === true ? true : false;
		options.beforeSend = options.beforeSend || function(xhr) {
			var securityUser = LM.getLoginUser(true);

			if (securityUser) {
				LM.refreshActiveTimestamp(timeStamp);
				xhr.setRequestHeader('Authorization',
					utils.getAuthToken(timeStamp, securityUser.username, securityUser.securityToken, true));
			}

			if(options.customHeaders){
				_.each(options.customHeaders, function(value, key){
					xhr.setRequestHeader(key, value);
				});
			}
		};

		var success = options.success,
			error = options.error;

		options.success = function(data, textStatus, jqXHR) {
			if (jqXHR.status == 204) {
				if ($.isFunction(success)) {
					success(data || {});
				}
			} else if (!data || data.status !== 1200) {
				if (data && data.status === 401) {
					LM.logoffUser(true);
				} else if ($.isFunction(error)) {
					error(data || {});
				} else {
					// the default error function if caller not define it
					require(['lmmsgbox'], function (MessageBox) {
						var response = data || {};

						MessageBox.alert((!response.errmsg || response.errmsg == 'error') ?
							('Error - status(' + response.status + ' : ' + jqXHR.statusText + ') errmsg:' + response.errmsg) : response.errmsg);
					});
				}
			} else {
				if ($.isFunction(success)) {
					success(data || {});
				}
			}
		};

		options.error = function(jqXHR, textStatus, errorThrown) {
			if (jqXHR.status === 401) {
				LM.logoffUser(true);
			} else if ($.isFunction(error)) {
				error({
					status: jqXHR.status || 0,
					errmsg: jqXHR.statusText
				});
			} else {
				// the default error function if caller not define it
				require(['lmmsgbox'], function (MessageBox) {
					var response = {
						status: jqXHR.status || 0,
						errmsg: jqXHR.statusText
					};

					MessageBox.alert( 'Error - status(' + response.status + ' : ' + jqXHR.statusText + ') errmsg:' + response.errmsg);
				});
			}
		};

		return $.ajax(options);
	};

	/**
	 * Define LM.Model as the base model for all models
	 */
    LM.Model = B2.Model.extend({
	    parse: function (response) {
		    if (response.status != void 0 && response.data) {
			    return response.data;
		    } else {
			    return response;
		    }
	    },

	    save: function (key, val, options) {
		    var opts = options || {};

		    // Handle both `"key", value` and `{key: value}` -style arguments.
		    if (key == null || typeof key === 'object') {
			    opts = val || {};
		    }

		    if (!opts.error) {
			    opts.error = function (model, response, options) {
				    require(['lmmsgbox'], function (MessageBox) {
					    MessageBox.alert( 'Error - status(' + response.status  + ')<br> errmsg:' + response.errmsg);
				    });
			    };
		    }

		    this._super(key, val || opts, opts);
	    },

	    destroy: function (options) {
		    options = options ? _.clone(options) : {};

		    if (!options.error) {
			    options.error = function (model, response, options) {
				    require(['lmmsgbox'], function (MessageBox) {
					    MessageBox.alert( 'Error - status(' + response.status  + ')<br> errmsg:' + response.errmsg);
				    });
			    };
		    }

		    this._super(options);
	    }
    });

	/**
	 * Define LM.Collection as the base collection for all collections
	 */
    LM.Collection = B2.Collection.extend({
        parse: function (response) {
            if (response.status != void 0) {
                if (response.data && response.data.items)  {
                    return response.data.items || [];
                } else {
                    return response.data || [];
                }
            } else {
                return response;
            }
        }
    });

	/**
     * LM.View extends B2.View. All views & widgets have to
     * extends LM.View rather than Backbone.View.
     *
	 * LM.View has the app features, it can be used to manage sub views automatically
	 * to register a sub view, use "registerComponent"
	 * to listen the events of the sub view, use "appEvents"
	 * to get a registered component, use "getComponent"
     */
	LM.View = B2.View.extend({
	});


    //avoid console function throw error in IE
	(function () {
        var con = window.console;
        if (con !== undefined && con.log !== undefined) {
            return;
        }
        var noop = function () {
        };
        var methods = ['assert', 'clear', 'count', 'debug', 'dir',
            'dirxml', 'error', 'exception', 'group', 'groupCollapsed',
            'groupEnd', 'info', 'log', 'markTimeline', 'profile',
            'profileEnd', 'markTimeline', 'table', 'time', 'timeEnd',
            'timeStamp', 'trace', 'warn'
        ];
        var length = methods.length;
        var console = window.console = {};
        while (length--) {
            console[methods[length]] = noop;
        }
    })();

	$.fn.hasScrollBar = function () {
		//scrollHeight = topPadding + bottomPadding + contentHeight
		//innerHeight = topPadding + bottomPadding + contentHeight
		return this.prop('scrollHeight') > this.innerHeight();
	};

	window.LM = LM;

    return LM;
});
