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

  QUnit.asyncTest( "MessageBox should show correct content", function( assert ) {
    var testTitle = 'title123456';
    MessageBox.alert('content', testTitle);

    QUnit.equal($('.head-title-txt').text(), testTitle);
    QUnit.start();
  });

  QUnit.asyncTest( "MessageBox prompt should return corret input", function( assert ) {
    var testValue = 'input xxx';
    MessageBox.prompt('hello, world', function (value) {
        QUnit.equal(value, testValue);
        QUnit.start();
      }, 'Custom title', 'test value');
    $('.prompt-value').val(testValue);
    $('.btn-submit').click();
  });

  //require business js code end
});

