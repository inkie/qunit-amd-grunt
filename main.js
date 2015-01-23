define([
	'QUnit'
], function (QUnit) {
	console.log('\nInject Test case');


	test("title id", function(){
    console.log('\n Testing')
	  QUnit.equal(1,1);
	});
  QUnit.load();
  QUnit.start();


	console.log('\nTest case injected');


});
