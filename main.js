define([
	'QUnit',
	'lodash',
	'b2',
	'jquery',
	'handlebars',
	'core',
	'utils',

	'commons/logicmonitor/views/TopNavBarView',
	'lmblockui',
	'commons/logicmonitor/models/UserModel',

	'lmsidebar',
	'lmexpandtable',
	'lmdialog',
	'lmformdialog',
	'lmmsgbox',
	'lmdropdown',
	'lmdropdownmenu',
	'lmtable',
	'lmpager',
	'lmcriteriatable',
	'lmsearchbox',
	'lmtooltip',
	'lmautocomplete',
	'lminfotable',
	'lmfilterbar',
	'lmcheckboxdropdown',
	'lmradiodropdown',
	'lmautocompletedropdown',
	'jq-validationEngine-en'
], function (QUnit, _, B2, $, Handlebars, LM, utils, TopNavBarView, BlockUI) {
	$('h1').text('Log Test');
	console.log('\nTest begin');

	test("title id", function(){
		expect(1);
	  equal(1,1);
	  console.log('\n Test on')
	});
	QUnit.load();
	QUnit.start();

	// QUnit.test("title id", function() {
	// 	console.log('hehe')

	//   expect(1);
	//   // var title = 'Test MessageBox Title';
	//   // MessageBox.alert('Test MessageBox Title', 'success');
	//   QUnit.equal(1,2);
	// 	console.log('\nTest on');
	// 	done();
		
	//   // equal($('.head-title-txt'.text(), title);

	// });
	console.log('\nTest end');
	//require business js code end
});
