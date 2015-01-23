define([
  'lodash',
  'b2',
  'jquery',
  'handlebars',
  'core',
  'utils',

  // 'commons/logicmonitor/views/TopNavBarView',
  // 'lmblockui',
  // 'commons/logicmonitor/models/UserModel',

  // 'lmsidebar',
  // 'lmexpandtable',
  // 'lmdialog',
  // 'lmformdialog',
  'lmmsgbox',
  // 'lmdropdown',
  // 'lmdropdownmenu',
  // 'lmtable',
  // 'lmpager',
  // 'lmcriteriatable',
  // 'lmsearchbox',
  // 'lmtooltip',
  // 'lmautocomplete',
  // 'lminfotable',
  // 'lmfilterbar',
  // 'lmcheckboxdropdown',
  // 'lmradiodropdown',
  // 'lmautocompletedropdown',
  // 'jq-validationEngine-en'
], function (_, B2, $, Handlebars, LM, utils, MessageBox) {
  //require business js code begin
  MessageBox.alert('Title', 'success');
  
  QUnit.asyncTest( "assert.async() test2", function( assert ) {
    console.log('\n' + $('.head-title-txt').text());
    QUnit.equal($('.head-title-txt').text(),2);
    QUnit.start();
  });

  //require business js code end
});

