module.exports = function(grunt) {  // jshint ignore:line
	grunt.initConfig({
		qunit: {
			all: {
				options: {
					urls: [
						// 'http://localhost:8000/tests/unit/dialog/dialog.html?debug=1'
						'http://localhost:8000/test-demo.html?debug=1',
						// 'http://localhost:8001/',
						'http://localhost:8000/demo.html?debug=1'
					],
					page: {
						viewportSize: { width: 700, height: 500 }
					}
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-qunit');

	grunt.registerTask('test', ['qunit']);
};

