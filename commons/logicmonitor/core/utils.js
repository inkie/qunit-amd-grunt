define([
	'jquery',
	'lodash',
	'base64',
	'md5'
], function ($, _, Base64, md5) {
    return {
	    getFilterStr: function (filterObj) {
		    var filterStr = [];

		    filterObj = _.clone(filterObj, true);

		    //support key1:value1||key2:value2
		    var symbol = ',';
		    if(filterObj.isOr){
			    symbol = '||';
			    delete filterObj.isOr;
		    }

		    _.each(filterObj, function (value, key) {
			    if (value == null) {
				    return;
			    }

			    if (!_.isArray(value)) {
				    value = [value];
			    }

			    filterStr.push(key + ':' + encodeURIComponent(value.join('|')));
		    });

		    return encodeURIComponent(filterStr.join(symbol));
	    },

	    camelCase: function (str) {
		    return str.toLowerCase().replace(/-(.)/g, function(match, group1) {
			    return group1.toUpperCase();
		    });
	    },

	    buildUrl: function (base, paramObj) {
		    var sep = (base.indexOf('?') > -1) ? '&' : '?';

		    if (/\?$/.test(base)) {
			    sep = '';
		    }

		    _.each(paramObj, function (value, key) {
			    paramObj[key] = decodeURIComponent(value);
		    });

		    if (_.isEmpty(paramObj)) {
			    return base;
		    } else {
			    return base + sep + $.param(paramObj);
		    }
	    },

	    compactObject: function (obj) {
		    for (var i in obj) {
			    if (obj.hasOwnProperty(i) && obj[i] == null) {
				    delete obj[i];
			    }
		    }

		    return obj;
	    },

	    chunk: function (tasks, process, chunkSize, context) {
		    chunkSize = chunkSize || 1;

		    var oriChunkSize = chunkSize;

		    setTimeout(function chunk(){
			    chunkSize = oriChunkSize;

			    while (chunkSize-- && tasks.length > 0) {
				    var item = tasks.shift();
				    process.call(context, item);
			    }

			    if (tasks.length > 0){
				    setTimeout(chunk);
			    }
		    });
	    },

	    /**
	     * Get the auth token value base on the user name, security password and timestamp.
	     * @param u username, default is window.securityUserName
	     * @param p security token, default is window.securityToken
	     * @param timestamp
	     */
	    getAuthToken: function (timestamp, u, p, useInHttpHeader) {
		    var secUser = u, secToken = p;
		    var base64Token = Base64.encode(secUser + ':' + md5(secToken + timestamp));

		    if (useInHttpHeader) {
			    return 'Basic ' + base64Token;
		    } else {
			    return base64Token;
		    }
	    },

	    loadCssFile: function (filename) {
		    var fileref = document.createElement('link');
		    fileref.setAttribute('rel', 'stylesheet');
		    fileref.setAttribute('type', 'text/css');
		    fileref.setAttribute('href', filename);

		    if (typeof fileref != 'undefined') {
			    document.getElementsByTagName('head')[0].appendChild(fileref);
	        }
		},

	    removeCssFile: function (filename) {
		    $('link[rel=stylesheet][href="' + filename + '"]').remove();
	    }
    };
});
