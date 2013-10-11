var buster = require('buster');
var extension = require('../lib/buster-selenium');
var c = require('buster-configuration');

var testCase = buster.testCase;
var assert = buster.assert;
var refute = buster.refute;

var withGroup = function (body, tests) {
    var group, rs, err, data, loadedTests;
    var instance = tests(
		function() { return group; },
		function() { return rs; },
		function() { return err; },
		function() { return data; },
		function() { return loadedTests; }
    );

	instance.setUp = function() {
		body.extensions = [extension];
		group = c.createConfiguration().addGroup("test", body, __dirname + "/fixtures");

		group.resolve().then(function(resourceSet) {
			rs = resourceSet;
			var paths = resourceSet.loadPath.paths();
			loadedTests = paths.filter(function(p) {
				return p.indexOf("/buster") !== 0;
			});
			// rs.get("/buster/load-all.js").content().then(done(function(content) {
			// 	data = content;
			// }));
		});
	};

	return instance;
};

testCase('Buster Selenium', {
	'extension should be an object': function(){
		assert.isObject(extension);
	},

	'configuration': {
		'empty config group': withGroup({}, function(group, rs, err, data, loadedTests){
			return {
				'sets options and webdriver objects': function(){
					var groupExt = group().extensions[0];

					assert.isObject(options);
					assert.isObject(groupExt.webdriver);
				}
			}
		}),
	},

	'// create consumes options and returns an instance': function(){},
	'// configure': function(){},
	'// beforeRun': function(){},
	'// testRun should add a webdriver object to the test context': function(){}
});