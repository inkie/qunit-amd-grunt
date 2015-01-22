require.config({
    urlArgs: 'v=',
	baseUrl: '',
	waitSeconds: 0,
	packages: ['commons/logicmonitor/templates', 'commons/logicmonitor/controls/templates', 'demo/templates',
		'demo/views/sub', 'login/templates', 'password/templates', 'signup/templates', 'index/templates',
		'profile/templates','debug/templates'],
	paths: {
        'commons/logicmonitor/partials_compiled': 'commons/logicmonitor/templates/.auto_partials',
        'commons/logicmonitor/templates_compiled': 'commons/logicmonitor/templates/.auto_templates',

		'commons/logicmonitor/controls/partials_compiled': 'commons/logicmonitor/controls/templates/.auto_partials',
		'commons/logicmonitor/controls/templates_compiled': 'commons/logicmonitor/controls/templates/.auto_templates',

        'demo/partials_compiled': 'demo/templates/.auto_partials',
        'demo/templates_compiled': 'demo/templates/.auto_templates',

		'login/partials_compiled': 'login/templates/.auto_partials',
		'login/templates_compiled': 'login/templates/.auto_templates',

		'password/partials_compiled': 'password/templates/.auto_partials',
		'password/templates_compiled': 'password/templates/.auto_templates',

		'signup/partials_compiled': 'signup/templates/.auto_partials',
		'signup/templates_compiled': 'signup/templates/.auto_templates',

		'index/partials_compiled': 'index/templates/.auto_partials',
		'index/templates_compiled': 'index/templates/.auto_templates',

		'profile/partials_compiled': 'profile/templates/.auto_partials',
		'profile/templates_compiled': 'profile/templates/.auto_templates',

        'debug/partials_compiled': 'debug/templates/.auto_partials',
        'debug/templates_compiled': 'debug/templates/.auto_templates',

		'core': 'commons/logicmonitor/core/core',
		'utils': 'commons/logicmonitor/core/utils',
		'modelurls': 'commons/logicmonitor/models/ModelUrls',

        /* 3rd party libs*/
		'handlebars': 'commons/3rdparty/handlebars/handlebars-v2.0.0',
        'lodash': 'commons/3rdparty/lodash',
        'backbone': 'commons/3rdparty/backbone',
        'jquery': 'commons/3rdparty/jquery-2.1.1',
        'bootstrap': 'commons/3rdparty/bootstrap',
		'b2': 'commons/3rdparty/b2',
		'async': 'commons/3rdparty/async',
		'highcharts': 'commons/3rdparty/highcharts/highcharts.src',
		'highcharts-exporting': 'commons/3rdparty/highcharts/modules/exporting.src',
		'jq-validationEngine': 'commons/3rdparty/jquery.validationEngine',
		'jq-validationEngine-en': 'commons/3rdparty/jquery.validationEngine-en',
		'base64': 'commons/3rdparty/base64',
		'md5': 'commons/3rdparty/md5',
		'moment': 'commons/3rdparty/moment',
		'es5-shim': 'commons/3rdparty/es5-shim',
		'jq-blockUI': 'commons/3rdparty/jquery.blockUI',
		'firebase': 'https://cdn.firebase.com/js/client/1.1.2/firebase',

		/*logicmonitor controls*/
		'lmsidebar': 'commons/logicmonitor/controls/Sidebar',
		'lmexpandtable': 'commons/logicmonitor/controls/ExpandTable',
		'lmdialog': 'commons/logicmonitor/controls/Dialog',
		'lmformdialog': 'commons/logicmonitor/controls/FormDialog',
		'lmmsgbox': 'commons/logicmonitor/controls/MessageBox',
		'lmdropdown': 'commons/logicmonitor/controls/DropDown',
		'lmdropdownmenu': 'commons/logicmonitor/controls/DropDownMenu',
		'lmtable': 'commons/logicmonitor/controls/Table',
		'lmpager': 'commons/logicmonitor/controls/Pager',
		'lmcriteriatable': 'commons/logicmonitor/controls/CriteriaTable',
		'lmsearchbox': 'commons/logicmonitor/controls/SimpleSearchBox',
		'lmtooltip': 'commons/logicmonitor/controls/Tooltip',
		'lmautocomplete': 'commons/logicmonitor/controls/AutoComplete',
		'lminfotable': 'commons/logicmonitor/controls/InfoTable',
		'lmfilterbar': 'commons/logicmonitor/controls/FilterBar',
		'lmcheckboxdropdown': 'commons/logicmonitor/controls/filterbar/CheckboxDropDown',
		'lmradiodropdown': 'commons/logicmonitor/controls/filterbar/RadioDropDown',
		'lmautocompletedropdown': 'commons/logicmonitor/controls/filterbar/AutoCompleteDropDown',
		'lmblockui': 'commons/logicmonitor/controls/BlockUI',
		'lmdatepicker': 'commons/3rdparty/jquery-ui/jquery-ui-timepicker-addon',
		'lmtimepicker': 'commons/3rdparty/jquery-ui/jquery.timepickr'
	},
	shim: {
        'handlebars': {
            exports: 'Handlebars'
        },
		'highcharts': {
			deps: ['jquery'],
			exports: 'Highcharts'
		},
		'highcharts-exporting': {
			deps: ['highcharts'],
			exports: 'Highcharts'
		},
		'jq-validationEngine': ['jquery'],
		'jq-validationEngine-en': ['jq-validationEngine'],
		'base64': {
			exports: 'Base64'
		},
		'firebase': {
			exports: 'Firebase'
		}
	},
	map: {
		'*': {
			'underscore': 'lodash'
		}
	}
});

